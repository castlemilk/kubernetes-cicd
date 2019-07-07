package main

import (
	"context"
	"flag"
	"log"
	"net/http"
	"sync"
	"time"
	"os"
	"fmt"
	"strconv"
	"encoding/json"
	"bytes"
	// "io/ioutil"
	
	"github.com/knative/eventing-contrib/pkg/kncloudevents"

	"github.com/cloudevents/sdk-go/pkg/cloudevents"
	"github.com/cloudevents/sdk-go/pkg/cloudevents/types"
	"github.com/kelseyhightower/envconfig"
	gh "gopkg.in/go-playground/webhooks.v5/github"
)

// GitRepoStatus represents the progress made synchronising with a git
// repo. These are given below in expected order, but the status may
// go backwards if e.g., a deploy key is deleted.
type GitRepoStatus string

const (
	NoChange GitRepoStatus = "nochange" // configuration is empty
	NewPR    GitRepoStatus = "newpr"    // no attempt made to clone it yet
)

type GitHubPRStatuses string
const (
	Error GitHubPRStatuses = "error"
	Failure GitHubPRStatuses = "failure"
	Pending GitHubPRStatuses = "pending"
	Success GitHubPRStatuses = "success" 
)

type Repo struct {
	interval time.Duration
	repourl  string
	status   GitRepoStatus
	err      error
	// State
	mu     sync.RWMutex
	notify chan struct{}
	C      chan struct{}
}

//Interval between repository PR scans
type PollInterval time.Duration

//deserialising GitHub pull request structure
type PullRequest struct {
	URL string `json:"url"`
	StatusesURL string `json:"statuses_url"`
	Number int `json:"number"`
	Title string
	Created time.Time
}

//GitHub Statuses request payload
type Statuses struct {
	State GitHubPRStatuses
	TargetURL string `json:"target_url"`
	Description string
	Context string
}

func (p PollInterval) apply(r *Repo) {
	r.interval = time.Duration(p)
}

var (
	eventSource string
	eventType   string
	sink        string
	periodStr   string
	repourl     string
	accessToken string
)

func init() {
	flag.StringVar(&eventSource, "eventSource", "", "the event-source (CloudEvents)")
	flag.StringVar(&eventType, "eventType", "dev.knative.eventing.github.pull_request", "the event-type (CloudEvents)")
	flag.StringVar(&sink, "sink", "", "the host url to heartbeat to")
	flag.StringVar(&repourl, "repourl", "https://api.github.com/repos/castlemilk/kubernetes-cicd", "the repository to poll")
	flag.StringVar(&periodStr, "period", "20", "the polling interval for checking github")
	flag.StringVar(&accessToken, "accessToken", "xxxx", "access token for repository")
}

type envConfig struct {
	// Sink URL where to send heartbeat cloudevents
	Sink    string `envconfig:"SINK"`
	RepoURL string `envconfig:"REPO_URL"`

	// Name of this pod.
	Name string `envconfig:"POD_NAME"`
	AccessToken string `envconfig:"ACCESS_TOKEN"`

	// Namespace this pod exists in.
	Namespace string `envconfig:"POD_NAMESPACE"`
}


func Get(url string, class interface{}) {
	resp, err := http.Get(url)
	if err != nil {
		// handle error
		log.Fatal(err)
	}	
	decoder := json.NewDecoder(resp.Body)
	decoder.Decode(&class)
}

func CreateStatus(url string, state GitHubPRStatuses) {
	payload := map[string]interface{}{
		"state":state,
		"description": "Build pipeline started",
		"context": "continous-integration/tekton",
	}
	jsonValue, _ := json.Marshal(payload)
	fmt.Println("url:", url)
	fmt.Println("payload:", bytes.NewBuffer(jsonValue))
	resp, err := http.Post(url, "application/json", bytes.NewBuffer(jsonValue))
	if err != nil {
		panic(err)
	}
	fmt.Println("request URL:", resp.Request.URL.String())
	fmt.Println("response Status:", resp.Status)
	fmt.Println("response Headers:", resp.Header)

}

func main() {
	flag.Parse()
	var basic gh.PushPayload
	basePushPayload, err := os.Open("push.json")
	decoder := json.NewDecoder(basePushPayload)
	decoder.Decode(&basic)
	defer func() {
		_ = basePushPayload.Close()
	}()
	var env envConfig
	if err := envconfig.Process("", &env); err != nil {
		log.Printf("[ERROR] Failed to process env var: %s", err)
		os.Exit(1)
	}
	if env.Sink != "" {
		sink = env.Sink
	}
	if env.RepoURL != "" {
		repourl = env.RepoURL
	}

	// c, err := kncloudevents.NewDefaultClient(sink)
	// if err != nil {
	// 	log.Fatalf("failed to create client: %s", err.Error())
	// }

	var period time.Duration
	if p, err := strconv.Atoi(periodStr); err != nil {
		period = time.Duration(5) * time.Second
	} else {
		period = time.Duration(p) * time.Second
	}
	if eventSource == "" {
		eventSource = fmt.Sprintf("https://github.com/castlemilk/kubernetes-cicd")
		log.Printf("git-poller Source: %s", eventSource)
		
	}
	pullURL := repourl + "/pulls"
	log.Printf("pull url: %s", pullURL)	
	ticker := time.NewTicker(period)
	c, err := kncloudevents.NewDefaultClient("http://10.100.32.93:8082")
	if err != nil {
		log.Fatalf("failed to create client: %s", err.Error())
	}	
	for {
		
		var pulls []PullRequest
		Get(pullURL, &pulls)
		for _, pullRequest := range pulls {
			var statuses []Statuses
			fmt.Printf("status_url: %s\n", pullRequest.StatusesURL)
			Get(pullRequest.StatusesURL, &statuses)
			statuses_list, _ := json.Marshal(statuses)
			log.Printf("statuses: %s, status_count: %d\n", string(statuses_list), len(statuses))
			if len(statuses) == 0 {
				log.Printf("new PR [%d], initiasing build process", pullRequest.Number)
				CreateStatus(pullRequest.StatusesURL + "?access_token=" + env.AccessToken , Pending)
				event := cloudevents.Event{
					Context: cloudevents.EventContextV02{
						Type:   "dev.knative.source.github.push",
						Source: *types.ParseURLRef(eventSource),
						// Extensions: map[string]interface{}{
						// 	"the":   42,
						// 	"heart": "yes",
						// 	"beats": true,
						// },
					}.AsV02(),
					Data: basic,
				}
		
				if _, err := c.Send(context.Background(), event); err != nil {
					log.Printf("failed to send cloudevent: %s", err.Error())
				}

			} else {
				CreateStatus(pullRequest.StatusesURL + "?access_token=" + env.AccessToken, Success)	
			}

		}
		pullString, _ := json.Marshal(pulls)
		log.Printf(string(pullString))
		// Wait for next tick
		<-ticker.C
	}
}

package main

import (
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

// PullRequest represents a GitHub pull request on a repository.
type PullRequest struct {
	ID                   int64     `json:"id,omitempty"`
	Number               int       `json:"number,omitempty"`
	State                string    `json:"state,omitempty"`
	Title                string    `json:"title,omitempty"`
	Body                 string    `json:"body,omitempty"`
	CreatedAt            time.Time `json:"created_at,omitempty"`
	UpdatedAt            time.Time `json:"updated_at,omitempty"`
	ClosedAt             time.Time `json:"closed_at,omitempty"`
	MergedAt             time.Time `json:"merged_at,omitempty"`
	User                 User      `json:"user,omitempty"`
	Draft                bool      `json:"draft,omitempty"`
	Merged               bool      `json:"merged,omitempty"`
	Mergeable            bool      `json:"mergeable,omitempty"`
	MergeableState       string    `json:"mergeable_state,omitempty"`
	MergedBy             User      `json:"merged_by,omitempty"`
	MergeCommitSHA       string    `json:"merge_commit_sha,omitempty"`
	Comments             int       `json:"comments,omitempty"`
	Commits              int       `json:"commits,omitempty"`
	Additions            int       `json:"additions,omitempty"`
	Deletions            int       `json:"deletions,omitempty"`
	ChangedFiles         int       `json:"changed_files,omitempty"`
	URL                  string    `json:"url,omitempty"`
	HTMLURL              string    `json:"html_url,omitempty"`
	IssueURL             string    `json:"issue_url,omitempty"`
	StatusesURL          string    `json:"statuses_url,omitempty"`
	DiffURL              string    `json:"diff_url,omitempty"`
	PatchURL             string    `json:"patch_url,omitempty"`
	CommitsURL           string    `json:"commits_url,omitempty"`
	CommentsURL          string    `json:"comments_url,omitempty"`
	ReviewCommentsURL    string    `json:"review_comments_url,omitempty"`
	ReviewCommentURL     string    `json:"review_comment_url,omitempty"`
	ReviewComments       int       `json:"review_comments,omitempty"`
	Assignee             User      `json:"assignee,omitempty"`
	Assignees           [] User    `json:"assignees,omitempty"`
	MaintainerCanModify  bool      `json:"maintainer_can_modify,omitempty"`
	AuthorAssociation    string    `json:"author_association,omitempty"`
	NodeID               string    `json:"node_id,omitempty"`
	RequestedReviewers  [] User    `json:"requested_reviewers,omitempty"`

	Links  PRLinks           `json:"_links,omitempty"`
	Head   PullRequestBranch `json:"head,omitempty"`
	Base   PullRequestBranch `json:"base,omitempty"`

	// ActiveLockReason is populated only when LockReason is provided while locking the pull request.
	// Possible values are: "off-topic", "too heated", "resolved", and "spam".
	ActiveLockReason  string `json:"active_lock_reason,omitempty"`
}
// PRLink represents a single link object from Github pull request _links.
type PRLink struct {
	HRef  string `json:"href,omitempty"`
}

// PRLinks represents the "_links" object in a Github pull request.
type PRLinks struct {
	Self            PRLink `json:"self,omitempty"`
	HTML            PRLink `json:"html,omitempty"`
	Issue           PRLink `json:"issue,omitempty"`
	Comments        PRLink `json:"comments,omitempty"`
	ReviewComments  PRLink `json:"review_comments,omitempty"`
	ReviewComment   PRLink `json:"review_comment,omitempty"`
	Commits         PRLink `json:"commits,omitempty"`
	Statuses        PRLink `json:"statuses,omitempty"`
}
// PullRequestBranch represents a base or head branch in a GitHub pull request.
type PullRequestBranch struct {
	Label  string     `json:"label,omitempty"`
	Ref    string     `json:"ref,omitempty"`
	SHA    string     `json:"sha,omitempty"`
	Repo   Repository `json:"repo,omitempty"`
	User   User       `json:"user,omitempty"`
}

// User represents a GitHub user.
type User struct {
	Login                    string    `json:"login,omitempty"`
	ID                       int64     `json:"id,omitempty"`
	NodeID                   string    `json:"node_id,omitempty"`
	AvatarURL                string    `json:"avatar_url,omitempty"`
	HTMLURL                  string    `json:"html_url,omitempty"`
	GravatarID               string    `json:"gravatar_id,omitempty"`
	Name                     string    `json:"name,omitempty"`
	Company                  string    `json:"company,omitempty"`
	Blog                     string    `json:"blog,omitempty"`
	Location                 string    `json:"location,omitempty"`
	Email                    string    `json:"email,omitempty"`
	Hireable                 bool      `json:"hireable,omitempty"`
	Bio                      string    `json:"bio,omitempty"`
	PublicRepos              int       `json:"public_repos,omitempty"`
	PublicGists              int       `json:"public_gists,omitempty"`
	Followers                int       `json:"followers,omitempty"`
	Following                int       `json:"following,omitempty"`
	CreatedAt                Timestamp `json:"created_at,omitempty"`
	UpdatedAt                Timestamp `json:"updated_at,omitempty"`
	SuspendedAt              Timestamp `json:"suspended_at,omitempty"`
	Type                     string    `json:"type,omitempty"`
	SiteAdmin                bool      `json:"site_admin,omitempty"`
	TotalPrivateRepos        int       `json:"total_private_repos,omitempty"`
	OwnedPrivateRepos        int       `json:"owned_private_repos,omitempty"`
	PrivateGists             int       `json:"private_gists,omitempty"`
	DiskUsage                int       `json:"disk_usage,omitempty"`
	Collaborators            int       `json:"collaborators,omitempty"`
	TwoFactorAuthentication  bool      `json:"two_factor_authentication,omitempty"`
	LdapDn                   string    `json:"ldap_dn,omitempty"`

	// API URLs
	URL                string `json:"url,omitempty"`
	EventsURL          string `json:"events_url,omitempty"`
	FollowingURL       string `json:"following_url,omitempty"`
	FollowersURL       string `json:"followers_url,omitempty"`
	GistsURL           string `json:"gists_url,omitempty"`
	OrganizationsURL   string `json:"organizations_url,omitempty"`
	ReceivedEventsURL  string `json:"received_events_url,omitempty"`
	ReposURL           string `json:"repos_url,omitempty"`
	StarredURL         string `json:"starred_url,omitempty"`
	SubscriptionsURL   string `json:"subscriptions_url,omitempty"`


	// Permissions identifies the permissions that a user has on a given
	// repository. This is only populated when calling Repositories.ListCollaborators.
	Permissions  map[string]bool `json:"permissions,omitempty"`
}

// Repository represents a GitHub repository.
type Repository struct {
	ID                int64           `json:"id,omitempty"`
	NodeID            string          `json:"node_id,omitempty"`
	Owner             User            `json:"owner,omitempty"`
	Name              string          `json:"name,omitempty"`
	FullName          string          `json:"full_name,omitempty"`
	Description       string          `json:"description,omitempty"`
	Homepage          string          `json:"homepage,omitempty"`
	DefaultBranch     string          `json:"default_branch,omitempty"`
	MasterBranch      string          `json:"master_branch,omitempty"`
	CreatedAt         Timestamp       `json:"created_at,omitempty"`
	PushedAt          Timestamp       `json:"pushed_at,omitempty"`
	UpdatedAt         Timestamp       `json:"updated_at,omitempty"`
	HTMLURL           string          `json:"html_url,omitempty"`
	CloneURL          string          `json:"clone_url,omitempty"`
	GitURL            string          `json:"git_url,omitempty"`
	MirrorURL         string          `json:"mirror_url,omitempty"`
	SSHURL            string          `json:"ssh_url,omitempty"`
	SVNURL            string          `json:"svn_url,omitempty"`
	Language          string          `json:"language,omitempty"`
	Fork              bool            `json:"fork,omitempty"`
	ForksCount        int             `json:"forks_count,omitempty"`
	NetworkCount      int             `json:"network_count,omitempty"`
	OpenIssuesCount   int             `json:"open_issues_count,omitempty"`
	StargazersCount   int             `json:"stargazers_count,omitempty"`
	SubscribersCount  int             `json:"subscribers_count,omitempty"`
	WatchersCount     int             `json:"watchers_count,omitempty"`
	Size              int             `json:"size,omitempty"`
	AutoInit          bool            `json:"auto_init,omitempty"`
	Permissions       map[string]bool `json:"permissions,omitempty"`
	AllowRebaseMerge  bool            `json:"allow_rebase_merge,omitempty"`
	AllowSquashMerge  bool            `json:"allow_squash_merge,omitempty"`
	AllowMergeCommit  bool            `json:"allow_merge_commit,omitempty"`
	Topics           []string         `json:"topics,omitempty"`
	Archived          bool            `json:"archived,omitempty"`
	Disabled          bool            `json:"disabled,omitempty"`


	// Additional mutable fields when creating and editing a repository
	Private            bool   `json:"private,omitempty"`
	HasIssues          bool   `json:"has_issues,omitempty"`
	HasWiki            bool   `json:"has_wiki,omitempty"`
	HasPages           bool   `json:"has_pages,omitempty"`
	HasProjects        bool   `json:"has_projects,omitempty"`
	HasDownloads       bool   `json:"has_downloads,omitempty"`
	LicenseTemplate    string `json:"license_template,omitempty"`
	GitignoreTemplate  string `json:"gitignore_template,omitempty"`

	// Creating an organization repository. Required for non-owners.
	TeamID  int64 `json:"team_id,omitempty"`

	// API URLs
	URL               string `json:"url,omitempty"`
	ArchiveURL        string `json:"archive_url,omitempty"`
	AssigneesURL      string `json:"assignees_url,omitempty"`
	BlobsURL          string `json:"blobs_url,omitempty"`
	BranchesURL       string `json:"branches_url,omitempty"`
	CollaboratorsURL  string `json:"collaborators_url,omitempty"`
	CommentsURL       string `json:"comments_url,omitempty"`
	CommitsURL        string `json:"commits_url,omitempty"`
	CompareURL        string `json:"compare_url,omitempty"`
	ContentsURL       string `json:"contents_url,omitempty"`
	ContributorsURL   string `json:"contributors_url,omitempty"`
	DeploymentsURL    string `json:"deployments_url,omitempty"`
	DownloadsURL      string `json:"downloads_url,omitempty"`
	EventsURL         string `json:"events_url,omitempty"`
	ForksURL          string `json:"forks_url,omitempty"`
	GitCommitsURL     string `json:"git_commits_url,omitempty"`
	GitRefsURL        string `json:"git_refs_url,omitempty"`
	GitTagsURL        string `json:"git_tags_url,omitempty"`
	HooksURL          string `json:"hooks_url,omitempty"`
	IssueCommentURL   string `json:"issue_comment_url,omitempty"`
	IssueEventsURL    string `json:"issue_events_url,omitempty"`
	IssuesURL         string `json:"issues_url,omitempty"`
	KeysURL           string `json:"keys_url,omitempty"`
	LabelsURL         string `json:"labels_url,omitempty"`
	LanguagesURL      string `json:"languages_url,omitempty"`
	MergesURL         string `json:"merges_url,omitempty"`
	MilestonesURL     string `json:"milestones_url,omitempty"`
	NotificationsURL  string `json:"notifications_url,omitempty"`
	PullsURL          string `json:"pulls_url,omitempty"`
	ReleasesURL       string `json:"releases_url,omitempty"`
	StargazersURL     string `json:"stargazers_url,omitempty"`
	StatusesURL       string `json:"statuses_url,omitempty"`
	SubscribersURL    string `json:"subscribers_url,omitempty"`
	SubscriptionURL   string `json:"subscription_url,omitempty"`
	TagsURL           string `json:"tags_url,omitempty"`
	TreesURL          string `json:"trees_url,omitempty"`
	TeamsURL          string `json:"teams_url,omitempty"`

}
type PullRequestPayload struct {
	Action      string `json:"action"`
	Number      int64  `json:"number"`
	PullRequest PullRequest
}
// Timestamp represents a time that can be unmarshalled from a JSON string
// formatted as either an RFC3339 or Unix timestamp. This is necessary for some
// fields since the GitHub API is inconsistent in how it represents times. All
// exported methods of time.Time can be called on Timestamp.
type Timestamp struct {
	time.Time
}

//GitHub Statuses request payload
type Statuses struct {
	State GitHubPRStatuses
	TargetURL string `json:"target_url"`
	Description string
	Context string
}

func (p PollInterval) apply(r  Repo) {
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
	basePushPayload, _ := os.Open("push.json")
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
		period = time.Duration(p) *  time.Second
	}
	if eventSource == "" {
		eventSource = fmt.Sprintf("https://github.com/castlemilk/kubernetes-cicd")
		log.Printf("git-poller Source: %s", eventSource)
		
	}
	pullURL := repourl + "/pulls"
	log.Printf("pull url: %s", pullURL)	
	ticker := time.NewTicker(period)
	for {
		
		var pulls []PullRequest
		Get(pullURL, &pulls)
		for _, pullRequest := range pulls {
			var statuses []Statuses
			fmt.Printf("status_url: %s\n", pullRequest.URL)
			Get(pullRequest.URL, &statuses)
			statuses_list, _ := json.Marshal(statuses)
			log.Printf("statuses: %s, status_count: %d\n", string(statuses_list), len(statuses))
			if len(statuses) == 0 {
				log.Printf("new PR [%d], initiasing build process", pullRequest.Number)
				CreateStatus(pullRequest.URL + "?access_token=" + env.AccessToken , Pending)

			} else {
				CreateStatus(pullRequest.URL + "?access_token=" + env.AccessToken, Success)

			}

		}
		pullString, _ := json.Marshal(pulls)
		log.Printf(string(pullString))
		// Wait for next tick
		<-ticker.C
	}
}

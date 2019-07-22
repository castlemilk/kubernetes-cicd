import React from 'react'
import {
  Heading,
  Slide,
  CodePane,
  Text,
  List,
  ListItem,
  Image,
  Appear,
  BlockQuote,
  Quote
} from 'spectacle'
import Terminal from 'spectacle-terminal'
import CodeSlide from 'spectacle-code-slide'
import { kustomizeFolderLayout, skaffoldConfig } from './messages'
import Demo from '../../../assets/demo.jpg'
import Kaniko from '../../../assets/kaniko.jpg'
import Tekton from '../../../assets/tekton.jpg'
import Spinnaker from '../../../assets/spinnaker.jpg'
import Skaffold from '../../../assets/skaffold.jpg'
import Kubernetes from '../../../assets/kubernetes.png'
import Kustomize from '../../../assets/kustomize.jpg'
import ConfigManagement from '../../../assets/configManagement.jpg'
import DevXP from '../../../assets/devXP.jpg'
import Github from '../../../assets/github.jpg'
import Jib from '../../../assets/jib.jpg'
import Pipelines from '../../../assets/pipelines.jpg'
const STYLE = {
  blue: { color: '#2196f3' },
  yellow: { color: 'yellow' },
  green: { color: 'green' }
}
const gitClone = `$ git clone git@gitlab.mantelgroup.com.au:future-tech/istio-training.git
$ cd istio-training
$ make bootstrap
`
const style = {
  note: { bottom: -25, position: 'relative' },
  pre: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  },
  title: { margin: 0, fontSize: '2em' },
  codeColor: '#d8d8d8'
}
export default [
  <Slide align='center center' transition={['zoom']} bgColor='primary'>
    <Image src={Kubernetes} />
    <Heading
      margin='100px 0 0 0'
      size={1}
      fit
      caps
      lineHeight={1}
      textColor='secondary'
    >
     Kubernetes-centric CI/CD  
    </Heading>
    <Text margin='30px 0 0' textColor='tertiary' size={5} bold>
      Ben Ebsworth
    </Text>
  </Slide>,
  <Slide align='center center' transition={['slide']} bgColor='primary'>
    <Heading textColor='#4285f4'>Build Tools</Heading>
  </Slide>,
  <Slide align='center center' transition={['zoom']} bgColor='primary'>
    <Image src={Kaniko} />
    <BlockQuote>
      <Quote textColor={'gray'} textSize={30}>
        Building docker images without the Docker daemon and in userspace.
        Enabling unprivileged and fast image builds.
      </Quote>
    </BlockQuote>
    <List>
      <Appear>
        <ListItem>
          Integrates with Cloud Build, enabling sophisticated caching for rapid
          builds
        </ListItem>
      </Appear>
      <Appear>
        <ListItem>
          Enables building of Docker images within a Kubernetes Cluster
        </ListItem>
      </Appear>
      <Appear>
        <ListItem>Integrates with Tekton</ListItem>
      </Appear>
    </List>
  </Slide>,
  <Slide align='center center' transition={['zoom']} bgColor='primary'>
  <Image height={300} src={Jib} />
  <BlockQuote>
    <Quote textColor={'gray'} textSize={30}>
      Builds optimized docker images and OCI images for Java applications without a Docker daemon. 
    </Quote>
  </BlockQuote>
  <List>
    <Appear>
      <ListItem>
        Separates your Java src into multiple layers, will only rebuild the layers that change between builds. Dramatically improving build times
      </ListItem>
    </Appear>
    <Appear>
      <ListItem>
        plugins available in Maven/Gradle
      </ListItem>
    </Appear>
  </List>
  </Slide>,
  <Slide align='center center' transition={['slide']} bgColor='primary' bgImage={Pipelines}
  bgDarken={0.50}>
    <Heading textColor={"#fabc08"}>Pipelines</Heading>
  </Slide>,
  <Slide align='center center' transition={['zoom']} bgColor='primary'>
  <Image height={200} src={Tekton} />
  <BlockQuote>
    <Quote textColor={'gray'} textSize={30}>
      Declarative and highly composable components for declaring CI/CD pipelines
    </Quote>
  </BlockQuote>
  <List>
    <Appear>
      <ListItem>
       Aims to provide a common set of fundamental CI/CD primitives, facilitating standardization and higher level frameworks to be implemented around it
      </ListItem>
    </Appear>
    <Appear>
      <ListItem>
        Runs inside Kubernetes. These components are represented as Custom Resource Definitions (CRDs)
      </ListItem>
    </Appear>
  </List>
  </Slide>,
  <Slide align='center center' transition={['zoom']} bgColor='primary'>
  <Image height={300} src={Spinnaker} />
  <BlockQuote>
    <Quote textColor={'gray'} textSize={30}>
    Continuous delivery platform for releasing software changes with high velocity and confidence
    </Quote>
  </BlockQuote>
  <List>
    <Appear>
      <ListItem>
      Kubernetes V2 provider enables utilizing of raw manifests and other templating tooling like Helm
      </ListItem>
    </Appear>
    <Appear>
      <ListItem>
        Canary analysis capability, providing confidence in releases
      </ListItem>
    </Appear>
    <Appear>
      <ListItem>
        Joined Continuous Delivery Foundation (CDF), along with Tekton and Jenkins
      </ListItem>
    </Appear>
  </List>
  </Slide>,
  <Slide align='center center' transition={['slide']} bgColor='primary' bgImage={ConfigManagement}
  bgDarken={0.50}>
    <Heading textColor="#ea4335">Configuration Management & Templating</Heading>
  </Slide>,
  <Slide align='center center' transition={['zoom']} bgColor='primary'>
  <Image height={200} src={Kustomize} />
  <BlockQuote>
    <Quote textColor={'gray'} textSize={30}>
    kustomize lets you customize raw, template-free YAML files for multiple purposes, leaving the original YAML untouched and usable as is
    </Quote>
  </BlockQuote>
  <List>
    <Appear>
      <ListItem>
      Provides a simplier way of defining resources and how to join together resources based of environment
      </ListItem>
    </Appear>
    <Appear>
      <ListItem>
        Supported by Skaffold, Argo
      </ListItem>
    </Appear>
    <Appear>
      <ListItem>
        Natively added to kubectl command-line client for Kubernetes
      </ListItem>
    </Appear>
  </List>
  </Slide>,
  <Slide align='center center' transition={['zoom']} bgColor='primary'>
  <Image height={200} src={Skaffold} />
  <BlockQuote>
    <Quote textColor={'gray'} textSize={30}>
    Continuous delivery platform for releasing software changes with high velocity and confidence
    </Quote>
  </BlockQuote>
  <List>
    <Appear>
      <ListItem>
      Utilised by Cloud Code to manage the build, test and deploy phases of development 
      </ListItem>
    </Appear>
    <Appear>
      <ListItem>
        Streamlines the management of contexts and/or environments by providing a "profile" approach to map configuration to a specific profile
      </ListItem>
    </Appear>
    <Appear>
      <ListItem>
        Integrates with modern build tooling, including Cloud Build, Kaniko & Jib.
      </ListItem>
    </Appear>
  </List>
  </Slide>,
  <Slide align='center center' transition={['slide']} bgColor='primary' bgColor='primary' bgDarken={0.50} bgImage={DevXP}>
    <Heading textColor="#34a752">Developer Experience</Heading>
  </Slide>,
  <Slide align='center center' transition={['zoom']} bgColor='primary'>
  <Heading textColor="#4285f4">Cloud Code</Heading>
  <BlockQuote>
    <Quote textColor={'gray'} textSize={30}>
    Tools to help you write, deploy, and debug cloud-native applications quickly and easily
    </Quote>
  </BlockQuote>
  <List>
    <Appear>
      <ListItem>
      Provides support for deploying GKE clusters
      </ListItem>
    </Appear>
    <Appear>
      <ListItem>
        Utilises skaffold to manage deployments, builds and hot-updating
      </ListItem>
    </Appear>
    <Appear>
      <ListItem>
        Plugin available in VS Code (Beta) and IntelliJ (Alpha)
      </ListItem>
    </Appear>
  </List>
  </Slide>,
  <Slide align='center center' transition={['zoom']} bgColor='primary' bgImage={Demo}
  bgDarken={0.50}>
    <Heading textColor={"#bc2cd8"}>Demo</Heading>
  </Slide>,
  <CodeSlide
    transition={['fade']}
    padding={0}
    titleStyle={style.title}
    noteStyle={style.note}
    codeStyle={{ fontSize: '0.8em' }}
    style={{ height: 640, padding: '24% 0px 0% 0px', ...style.pre }}
    lang='yaml'
    bgColor='codeBackground'
    color={style.codeColor}
    code={require('raw-loader!./code-examples/kustomize-folder-layout.txt')}
    ranges={kustomizeFolderLayout}
  />,
  <CodeSlide
  transition={['fade']}
  padding={0}
  titleStyle={style.title}
  noteStyle={style.note}
  codeStyle={{ fontSize: '0.8em' }}
  style={{ height: 640, padding: '48% 0px 0% 0px', ...style.pre }}
  lang='yaml'
  bgColor='codeBackground'
  color={style.codeColor}
  code={require('raw-loader!./code-examples/skaffoldConfig.txt')}
  ranges={skaffoldConfig}
  />,
  <Slide align='center center' transition={['slide']}>
    <Image height={200} src={Github} />
    <Heading margin="50px 0 0 0" textColor="secondary" size={4}>https://github.com/castlemilk/next-dev-xp</Heading>
  </Slide>,
]

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
import CodeSlide from 'spectacle-code-slide'
import { tektonConfig } from './messages'
import Demo from '../../../assets/demo.jpg'
import Kaniko from '../../../assets/kaniko.jpg'
import Tekton from '../../../assets/tekton.jpg'
import Spinnaker from '../../../assets/spinnaker.jpg'
import Skaffold from '../../../assets/skaffold.jpg'
import Kubernetes from '../../../assets/kubernetes.png'
import Kustomize from '../../../assets/kustomize.jpg'
import Perimeter from  '../../../assets/perimeter.jpg'
import Dockerless from '../../../assets/dockerless.jpg'
import BuildersFeatures from '../../../assets/builders-features.jpg'
import BuildersDocker from '../../../assets/builders-docker.jpg'
import BuildersBuildKit from '../../../assets/builders-buildkit.jpg'
import BuildersImg from '../../../assets/builders-img.jpg'
import BuildersBuildah from '../../../assets/builders-buildah.jpg'
import BuildersKaniko from '../../../assets/builders-kaniko.jpg'
import PipelinesFeatures from '../../../assets/pipelines-features.jpg'
import PipelinesJenkins from '../../../assets/pipelines-jenkins.jpg'
import PipelinesJenkinsX from '../../../assets/pipelines-jenkinsx.jpg'
import PipelinesArgo from '../../../assets/pipelines-argo.jpg'
import PipelinesTekton from '../../../assets/pipelines-tekton.jpg'
import PipelinesSpinnaker from '../../../assets/pipelines-spinnaker.jpg'
import PipelinesWeaveFlux from '../../../assets/pipelines-weaveflux.jpg'
import DevXPFeatures from '../../../assets/devxp-features.jpg'
import DevXPSkaffold from '../../../assets/devxp-skaffold.jpg'
import PipelineArchitecture from '../../../assets/pipeline-architecture.jpg'
import DevXPTilt from '../../../assets/devxp-tilt.jpg'
import DevXPGarden from '../../../assets/devxp-garden.jpg'
import LocalDevelopment from '../../../assets/local_development.jpg'
import RampUp from '../../../assets/ramp-up.jpg'
import Yaml from '../../../assets/yaml.jpg'
import Templating from '../../../assets/templating.jpg'
import Github from '../../../assets/github.jpg'

const COLOR_PALLETE = {
  blue: '#4285f4',
  red: '#d8133a',
  green: '#64c27c',
  yellow: '#f1cb31',
  purple: '#9f5ac7',

}
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
    {/* <Text margin='30px 0 0' textColor='tertiary' size={5} bold>
      Ben Ebsworth
    </Text> */}
  </Slide>,
  <Slide align='center center' transition={['slide']} bgColor='primary'>
  <Heading textColor={COLOR_PALLETE['blue']}>Overview</Heading>
    <List>
      <Appear>
        <ListItem>
          Why? - Benefits of running a kubernetes centric workflow 
        </ListItem>
      </Appear>
      <Appear>
        <ListItem>
          How? - Run down of current ecosystem available to achieve this goal
        </ListItem>
      </Appear>
      <Appear>
        <ListItem>
          Demonstration - An end-to-end example of a number of tools working together
        </ListItem>
      </Appear>
    </List> 
  </Slide>,
  <Slide align='center center' transition={['slide']} bgColor='primary'>
    <Heading textColor={COLOR_PALLETE['red']}>Why</Heading>
  </Slide>,
  <Slide align='center flex-top' transition={['slide']} bgColor='primary'>
    <Heading textColor={COLOR_PALLETE['red']}>Security</Heading>
    <Appear>
      <div style={{ float: 'left', marginTop: '200px', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
        <Image margin={"0 50px 0 0"}height={120} src={Kubernetes} />
        <Text margin="0" textColor='black' textSize={68} bold>
          Kubernetes Controls
        </Text> 
      </div>
    </Appear>
    <Appear>
      <div style={{ float: 'left', marginTop: '50px', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
        <Image margin={"0 50px 0 0"}height={120} src={Perimeter} />
        <Text margin="0" textColor='black' textSize={68} bold>
          Minimize access perimeter
        </Text> 
      </div>
    </Appear>
    <Appear>
      <div style={{ float: 'left', marginTop: '50px', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
        <Image margin={"0 50px 0 0"}height={120} src={Dockerless} />
        <Text margin="0" textColor='black' textSize={68} bold>
          Dockerless Builds
        </Text> 
      </div>
    </Appear>
  </Slide>,
  <Slide align='center flex-top' transition={['slide']} bgColor='primary'>
    <Heading textColor={COLOR_PALLETE['red']}>Idiomatic</Heading>
    <Appear>
      <div style={{ float: 'left', marginTop: '200px', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
        <Image margin={"0 50px 0 0"} height={120} src={Yaml} />
        <Text margin="0" textColor='black' textSize={68} bold>
          Everything represented as YAML
        </Text> 
      </div>
    </Appear>
    <Appear>
      <div style={{ float: 'left', marginTop: '60px', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
        <Image margin={"0 50px 0 0"} height={80} src={Templating} />
        <Text margin="0" textColor='black' textSize={68} bold>
          Standarising and Templating
        </Text> 
      </div>
    </Appear>
  </Slide>,
  <Slide align='center flex-top' transition={['slide']} bgColor='primary'>
    <Heading textColor={COLOR_PALLETE['red']}>Developer Experience</Heading>
    <Appear>
      <div style={{ float: 'left', marginTop: '200px', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
        <Image margin={"0 50px 0 0"} height={120} src={LocalDevelopment} />
        <Text margin="0" textColor='black' textSize={68} bold>
          Local development environment more closely resembles staging & production environment
        </Text> 
      </div>
    </Appear>
    <Appear>
      <div style={{ float: 'left', marginTop: '60px', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
        <Image margin={"0 50px 0 0"} height={120} src={RampUp} />
        <Text margin="0" textColor='black' textSize={68} bold>
          Helps develops ramp up on Kubernetes, enabling a "you build it, you run it" environment
        </Text> 
      </div>
    </Appear>
  </Slide>,
  <Slide align='center center' transition={['slide']} bgColor='primary'>
    <Heading textColor={COLOR_PALLETE['green']}>How</Heading>
  </Slide>,
  <Slide align='center flex-top' transition={['slide']} bgColor='primary'>
    <Heading textColor={COLOR_PALLETE['green']}>Builders</Heading>
    <div style={{ justifyContent: 'center', marginTop: '100px', display: 'flex', flexDirection: 'row'}}>
    <Appear>
        <Image margin={"0 0 0 0"} height={600} src={BuildersFeatures} />
    </Appear>
    <Appear>
        <Image margin={"0 0 0 0"} height={600} src={BuildersDocker} />
    </Appear>
    <Appear>
        <Image margin={"0 0 0 0"} height={600} src={BuildersBuildKit} />
    </Appear>
    <Appear>
        <Image margin={"0 0 0 0"} height={600} src={BuildersImg} />
    </Appear>
    <Appear>
        <Image margin={"0 0 0 0"} height={600} src={BuildersBuildah} />
    </Appear>
    <Appear>
        <Image margin={"0 0 0 0"} height={600} src={BuildersKaniko} />
    </Appear>
    </div>
  </Slide>,
  <Slide align='center flex-top' transition={['slide']} bgColor='primary'>
    <Heading textColor={COLOR_PALLETE['green']}>Pipelines</Heading>
    <div style={{ justifyContent: 'center', marginTop: '100px', display: 'flex', flexDirection: 'row'}}>
    <Appear>
        <Image margin={"0 0 0 0"} height={600} src={PipelinesFeatures} />
    </Appear>
    <Appear>
        <Image margin={"0 0 0 0"} height={600} src={PipelinesJenkins} />
    </Appear>
    <Appear>
        <Image margin={"0 0 0 0"} height={600} src={PipelinesJenkinsX} />
    </Appear>
    <Appear>
        <Image margin={"0 0 0 0"} height={600} src={PipelinesArgo} />
    </Appear>
    <Appear>
        <Image margin={"0 0 0 0"} height={600} src={PipelinesTekton} />
    </Appear>
    <Appear>
        <Image margin={"0 0 0 0"} height={600} src={PipelinesSpinnaker} />
    </Appear>
    <Appear>
        <Image margin={"0 0 0 0"} height={600} src={PipelinesWeaveFlux} />
    </Appear>
    </div>
  </Slide>,
  <Slide align='center flex-top' transition={['slide']} bgColor='primary'>
    <Heading textColor={COLOR_PALLETE['green']}>Developer Experience</Heading>
    <div style={{ justifyContent: 'center', marginTop: '100px', display: 'flex', flexDirection: 'row'}}>
    <Appear>
        <Image margin={"0 0 0 0"} height={600} src={DevXPFeatures} />
    </Appear>
    <Appear>
        <Image margin={"0 0 0 0"} height={600} src={DevXPSkaffold} />
    </Appear>
    <Appear>
        <Image margin={"0 0 0 0"} height={600} src={DevXPTilt} />
    </Appear>
    <Appear>
        <Image margin={"0 0 0 0"} height={600} src={DevXPGarden} />
    </Appear>
    </div>
  </Slide>,
  // TODO: add slides for comparing templating tools
  // <Slide align='center flex-top' transition={['slide']} bgColor='primary'>
  //   <Heading textColor={COLOR_PALLETE['green']}>Templating & Config Management</Heading>
  //   <div style={{ justifyContent: 'center', marginTop: '100px', display: 'flex', flexDirection: 'row'}}>
  //   <Appear>
  //       <Image margin={"0 0 0 0"} height={600} src={TemplatingFeatures} />
  //   </Appear>
  //   <Appear>
  //       <Image margin={"0 0 0 0"} height={600} src={TemplatingHelm} />
  //   </Appear>
  //   <Appear>
  //       <Image margin={"0 0 0 0"} height={600} src={TemplatingKustomize} />
  //   </Appear>
  //   <Appear>
  //       <Image margin={"0 0 0 0"} height={600} src={TemplatingJsonnet} />
  //   </Appear>
  //   <Appear>
  //       <Image margin={"0 0 0 0"} height={600} src={TemplatingKapitan} />
  //   </Appear>
  //   </div>
  // </Slide>,
  <Slide align='center center' transition={['slide']} bgColor='primary'>
    <Heading textColor={COLOR_PALLETE['purple']}>Demo</Heading>
  </Slide>,
  <Slide align='center flex-top' transition={['slide']} bgColor='primary'>
  <Heading textColor={COLOR_PALLETE['purple']}>CI/CD Pipeline</Heading>
  <Image margin={"100px auto"} height={600} src={PipelineArchitecture} />
</Slide>,
  <CodeSlide
  transition={['fade']}
  padding={0}
  // titleStyle={style.title}
  noteStyle={style.note}
  codeStyle={{ fontSize: '0.8em' }}
  style={{ padding: '2% 0px' }}
  lang='yaml'
  bgColor='codeBackground'
  color={style.codeColor}
  code={require('raw-loader!./code-examples/build.txt')}
  ranges={tektonConfig}
  />,
  <Slide align='center center' transition={['zoom']} bgColor='primary'>
    <Image style={{animation: 'rotation 10s linear infinite'}} src={Kubernetes} />
    <Heading
      margin='100px 0 0 0'
      size={1}
      fit
      caps  
      lineHeight={1}
      textColor='secondary'
    >
     Demo Time!  
    </Heading>
  </Slide>,
  <Slide align='center center' transition={['slide']}>
    <Image height={200} src={Github} />
    <Heading margin="50px 0 0 0" textColor="secondary" size={5}>https://github.com/castlemilk/kubernetes-cicd</Heading>
  </Slide>,
]

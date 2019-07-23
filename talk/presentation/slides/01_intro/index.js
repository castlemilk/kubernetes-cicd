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
import LocalDevelopment from '../../../assets/local_development.jpg'
import RampUp from '../../../assets/ramp-up.jpg'
import Yaml from '../../../assets/yaml.jpg'
import Templating from '../../../assets/templating.jpg'
import Github from '../../../assets/github.jpg'
const STYLE = {
  blue: { color: '#2196f3' },
  yellow: { color: 'yellow' },
  green: { color: 'green' }
}
const gitClone = `$ git clone git@gitlab.mantelgroup.com.au:future-tech/istio-training.git
$ cd istio-training
$ make bootstrap
`
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
    <Text margin='30px 0 0' textColor='tertiary' size={5} bold>
      Ben Ebsworth
    </Text>
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
  <Slide align='center center' transition={['slide']} bgColor='primary'>
    <Heading textColor={COLOR_PALLETE['green']}>Builders</Heading>
  </Slide>,
  <Slide align='center center' transition={['slide']} bgColor='primary'>
    <Heading textColor={COLOR_PALLETE['green']}>Pipelines</Heading>
  </Slide>,
  <Slide align='center center' transition={['slide']} bgColor='primary'>
    <Heading textColor={COLOR_PALLETE['green']}>Developer Experience</Heading>
  </Slide>,
  <Slide align='center center' transition={['slide']} bgColor='primary'>
    <Heading textColor={COLOR_PALLETE['green']}>Templating & Config Management</Heading>
  </Slide>,
  <Slide align='center center' transition={['slide']} bgColor='primary'>
    <Heading textColor={COLOR_PALLETE['purple']}>Demo</Heading>
  </Slide>,
  <Slide align='center center' transition={['slide']} bgColor='primary'>
    <Heading textColor={COLOR_PALLETE['purple']}>Architecture</Heading>
  </Slide>,
  <Slide align='center center' transition={['slide']} bgColor='primary'>
  <Heading textColor={COLOR_PALLETE['purple']}>CI/CD Pipeline</Heading>
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

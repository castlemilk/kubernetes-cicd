import React from "react";
import ReactDOM from "react-dom";

import lightTheme from "prism-react-renderer/themes/nightOwlLight";
import dracula from "prism-react-renderer/themes/dracula";

import {
  Appear,
  Box,
  CodePane,
  CodeSpan,
  Deck,
  FlexBox,
  FullScreen,
  Grid,
  Heading,
  Image,
  ListItem,
  Markdown,
  Notes,
  OrderedList,
  Progress,
  Slide,
  SpectacleLogo,
  Stepper,
  Text,
  UnorderedList,
  indentNormalizer
} from "spectacle";

import DigioLogo from "./assets/digio.png";
import SkaffoldLogo from "./assets/skaffold.png";

// SPECTACLE_CLI_THEME_START
const theme = {
  fonts: {
    header: '"Open Sans Condensed", Helvetica, Arial, sans-serif',
    text: '"Open Sans Condensed", Helvetica, Arial, sans-serif'
  },
  size: {
    maxCodePaneHeight: 500
  }
};
// SPECTACLE_CLI_THEME_END

// SPECTACLE_CLI_TEMPLATE_START
const template = () => (
  <FlexBox
    justifyContent="space-between"
    position="absolute"
    bottom={0}
    width={1}
  >
    <Box padding="0 1em">
      <FullScreen />
    </Box>
    <Box padding="1em">
      <Progress />
    </Box>
  </FlexBox>
);

console.log({ ...dracula, ...{ size: { maxCodePaneHeight: 500 } } });

const skaffoldCodeBlock = indentNormalizer(`
apiVersion: skaffold/v1beta13
kind: Config
build:
  artifacts:
    - image: products-backend
      context: src/backend
  tagPolicy:
    envTemplate:
      template: "{{.IMAGE_NAME}}:latest"
test:
  - image: products-backend:latest
    structureTests:
    - ./src/backend/tests/structure_test.yaml
deploy: {}
profiles:
  - name: local
    deploy:
      kustomize:
          path: deploy/overlays/local
          flags:
            global:
            - '-n=dev'
  - name: local-postgres
    deploy:
      kustomize:
          path: deploy/overlays/local-postgres
          flags:
            global:
            - '-n=dev'
  - name: staging
    build:
      artifacts:
        - image: gcr.io/kubernetes-cicd-246207/dev/backend
          context: src/backend
        - image: gcr.io/kubernetes-cicd-246207/dev/frontend
          context: src/frontend
    deploy:
      kustomize:
          path: deploy/overlays/staging
          flags:
            global:
            - '-n=np'
  ...
  ...
  ...
  ...
`);

const Presentation = () => (
  <Deck theme={theme} template={template} transitionEffect="fade">
    <Slide>
      <FlexBox height="100%" flexDirection="column">
        <Image src={DigioLogo} />
        <Heading marginTop="200px" fontSize="100px">
          Ben Ebsworth
        </Heading>
      </FlexBox>
    </Slide>
    <Slide>
      <FlexBox height="100%" flexDirection="column">
        <Heading margin="0px" fontSize="150px">
          Why Kubernetes
        </Heading>
      </FlexBox>
      <Notes>
        <p>Overview of what kubernetes and why you'd use it</p>
      </Notes>
    </Slide>
    <Slide>
      <FlexBox height="100%" flexDirection="column">
        <Heading margin="0px" fontSize="150px">
          Why Kubernetes
        </Heading>
      </FlexBox>
      <Notes>
        <p>Overview of what kubernetes and why you'd use it</p>
      </Notes>
    </Slide>
    <Slide>
      <FlexBox height="100%" flexDirection="column">
        <Heading margin="0px" fontSize="150px">
          Developer Experience
        </Heading>
      </FlexBox>
      <Notes>
        <p>
          Developer expeprience breakdown including: * Templating * local
          environment management via Skaffold * reproducable environments
        </p>
      </Notes>
    </Slide>
    <Slide>
      <FlexBox>
        <Text>Configuration Management</Text>
      </FlexBox>
      <Grid
        height={500}
        textAlign="centre"
        gridTemplateColumns="1fr 2fr"
        gridColumnGap={15}
      >
        <Box
          style={{
            justifyContent: "center",
            display: "flex",
            alignItems: "center",
            flexDirection: "column"
          }}
        >
          <Text>Skaffold</Text>
          <Image src={SkaffoldLogo} />
        </Box>
        <Stepper
          defaultValue={[]}
          height={500}
          values={[
            [1, 2],
            [3, 9],
            [10, 13],
            [15, 22],
            [23, 29],
            [30, 42]
          ]}
        >
          {(value, step) => (
            <Box height={500} position="relative">
              <CodePane
                highlightStart={value[0]}
                highlightEnd={value[1]}
                fontSize={18}
                language="yaml"
                style={{ maxHeight: 500, height: 500 }}
                theme={{ ...dracula, ...{ size: { maxCodePaneHeight: 500 } } }}
                autoFillHeight
              >
                {skaffoldCodeBlock}
              </CodePane>

              <Box
                position="absolute"
                bottom="0rem"
                left="0rem"
                right="0rem"
                bg="black"
              >
                {step === 0 && (
                  <Text fontSize="1.5rem" margin="0rem">
                    CustomResourceDefinition (CRD) for application and
                    environment config
                  </Text>
                )}
                {step === 1 && (
                  <Text fontSize="1.5rem" margin="0rem">
                    Define how to Build Images
                  </Text>
                )}
                {step === 2 && (
                  <Text fontSize="1.5rem" margin="0rem">
                    Add structural tests for images built
                  </Text>
                )}
                {step === 3 && (
                  <Text fontSize="1.5rem" margin="0rem">
                    Define deployment configuration with profiles for different
                    environments - i.e this is a local profile for local
                    development
                  </Text>
                )}
                {step === 4 && (
                  <Text fontSize="1.5rem" margin="0rem">
                    represent configuration for application dependencies (i.e
                    databases)
                  </Text>
                )}
                {step === 5 && (
                  <Text fontSize="1.5rem" margin="0rem">
                    represent your staging/non-prod application and environment
                    configuration
                  </Text>
                )}
              </Box>
            </Box>
          )}
        </Stepper>
      </Grid>
      <Grid
        gridTemplateColumns="1fr 1fr 1fr"
        gridTemplateRows="1fr 1fr 1fr"
        alignItems="center"
        justifyContent="center"
        gridRowGap={1}
      ></Grid>
    </Slide>
    <Slide>
      <FlexBox height="100%" flexDirection="column">
        <Heading margin="0px" fontSize="150px">
          Security
        </Heading>
      </FlexBox>
      <Notes>
        <p>
          Security Controls * NetworkPolicy * Conformance Testing * Admission
          and mutation Controls * fine grained RBAC
        </p>
      </Notes>
    </Slide>
    <Slide>
      <FlexBox height="100%" flexDirection="column">
        <Heading margin="0px" fontSize="150px">
          Continuous Integration
        </Heading>
      </FlexBox>
      <Notes>
        <p>
          * dockerless builds * CI pipelines within Kubernetes * security
          benefits
        </p>
      </Notes>
    </Slide>
    <Slide>
      <FlexBox height="100%" flexDirection="column">
        <Heading margin="0px" fontSize="150px">
          Application Delivery
        </Heading>
      </FlexBox>
      <Notes>
        <p>
          * easy to manage rollout strategies * easy to manage traffic steering
          * canary Testing * rollbacks
        </p>
      </Notes>
    </Slide>
    <Slide>
      <FlexBox height="100%" flexDirection="column">
        <Heading margin="0px" fontSize="150px">
          Service Mesh
        </Heading>
      </FlexBox>
      <Notes>
        <p>
          Options for service mesh on-top of kubernetes providing: * enhanced
          security (mTLS) between workloads * deep observability * advanced
          traffic steering * microservice RBAC enforcement * service resiliency
          (circuit breaking, rate limiting, retry and faul-injection)
        </p>
      </Notes>
    </Slide>
    <Slide>
      <FlexBox height="100%" flexDirection="column">
        <Heading margin="0px" fontSize="150px">
          Learnings in Productionising Kubernetes
        </Heading>
      </FlexBox>
      <Notes>
        <p>
          Restrospectives on developing production grade kubernetes environments
          * Iterate quickly and experiment * build end-to-end application
          delivery pipelines early and coverge on what works best * develop your
          observability progressively and keep improving it * i.e start with
          logging, then metrics, then tracing * build tooling to assist with
          local developer experience that assists with application onboarding *
          take a test-driven approach to platform development release
          engineering/processes
        </p>
      </Notes>
    </Slide>
    <Slide
      backgroundColor="tertiary"
      backgroundImage="url(https://github.com/FormidableLabs/dogs/blob/master/beau.jpg?raw=true)"
      backgroundOpacity={0.5}
    >
      <Heading>Custom Backgrounds</Heading>
      <UnorderedList>
        <ListItem>
          <CodeSpan>backgroundColor</CodeSpan>
        </ListItem>
        <ListItem>
          <CodeSpan>backgroundImage</CodeSpan>
        </ListItem>
        <ListItem>
          <CodeSpan>backgroundOpacity</CodeSpan>
        </ListItem>
        <ListItem>
          <CodeSpan>backgroundSize</CodeSpan>
        </ListItem>
        <ListItem>
          <CodeSpan>backgroundPosition</CodeSpan>
        </ListItem>
        <ListItem>
          <CodeSpan>backgroundRepeat</CodeSpan>
        </ListItem>
      </UnorderedList>
    </Slide>
    <Slide transitionEffect="slide">
      <Heading>Code Blocks</Heading>
      <Stepper
        defaultValue={[]}
        values={[
          [1, 1],
          [23, 25],
          [40, 42]
        ]}
      >
        {(value, step) => (
          <Box position="relative">
            <CodePane
              highlightStart={value[0]}
              highlightEnd={value[1]}
              fontSize={18}
              language="cpp"
              autoFillHeight
            >
              {cppCodeBlock}
            </CodePane>

            <Box
              position="absolute"
              bottom="0rem"
              left="0rem"
              right="0rem"
              bg="black"
            >
              {/* This notes container won't appear for step 0 */}

              {step === 1 && (
                <Text fontSize="1.5rem" margin="0rem">
                  This is a note!
                </Text>
              )}

              {step === 2 && (
                <Text fontSize="1.5rem" margin="0rem">
                  You can use the stepper state to render whatever you like as
                  you step through the code.
                </Text>
              )}
            </Box>
          </Box>
        )}
      </Stepper>
      <Text>
        Code Blocks now auto size and scroll when there is an overflow of
        content! They also auto-wrap longer lines.
      </Text>
    </Slide>
    <Slide>
      <Heading>Animated Elements</Heading>
      <OrderedList>
        <Appear elementNum={0}>
          <ListItem>Elements can animate in!</ListItem>
        </Appear>
        <Appear elementNum={2}>
          <ListItem>
            Just identify the order with the prop{" "}
            <CodeSpan>elementNum</CodeSpan>!
          </ListItem>
        </Appear>
        <Appear elementNum={1}>
          <ListItem>Out of order</ListItem>
        </Appear>
      </OrderedList>
    </Slide>
    <Slide>
      <FlexBox>
        <Text>These</Text>
        <Text>Text</Text>
        <Text color="secondary">Items</Text>
        <Text fontWeight="bold">Flex</Text>
      </FlexBox>
      <Grid gridTemplateColumns="1fr 2fr" gridColumnGap={15}>
        <Box backgroundColor="primary">
          <Text color="secondary">Single-size Grid Item</Text>
        </Box>
        <Box backgroundColor="secondary">
          <Text>Double-size Grid Item</Text>
        </Box>
      </Grid>
      <Grid
        gridTemplateColumns="1fr 1fr 1fr"
        gridTemplateRows="1fr 1fr 1fr"
        alignItems="center"
        justifyContent="center"
        gridRowGap={1}
      ></Grid>
    </Slide>
    <Slide>
      <Markdown>
        {`
          # Layout Tables in Markdown

          | Browser         | Supported | Versions |
          |-----------------|-----------|----------|
          | Chrome          | Yes       | Last 2   |
          | Firefox         | Yes       | Last 2   |
          | Opera           | Yes       | Last 2   |
          | Edge (EdgeHTML) | No        |          |
          | IE 11           | No        |          |
        `}
      </Markdown>
    </Slide>
    <Markdown containsSlides>
      {`
        ### Even write multiple slides in Markdown
        > Wonderfully formatted quotes

        1. Even create
        2. Lists in Markdown


        - Or Unordered Lists
        - Too!!
        Notes: These are notes
        ---
        ### This slide was also generated in Markdown!

        \`\`\`jsx
        const evenCooler = "is that you can do code in Markdown";
        // You can even specify the syntax type!
        \`\`\`

        ### A slide can have multiple code blocks too.

        \`\`\`c
        char[] someString = "Popular languages like C too!";
        \`\`\`

        Notes: These are more notes
      `}
    </Markdown>
  </Deck>
);

ReactDOM.render(<Presentation />, document.getElementById("root"));

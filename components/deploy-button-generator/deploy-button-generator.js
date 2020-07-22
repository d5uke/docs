import { useState, useEffect } from 'react'
import { useAmp } from 'next/amp'
import Tabs from '~/components/tabs'
import Snippet from '~/components/snippet'
import Details from '~/components/details'
import Input, { Clearable } from '~/components/input'
import Button from '~/components/buttons'
import Spacer from '~/components/spacer'
import ErrorMessage from '~/components/error'
import Container from '~/components/layout/container'
import Caption from '~/components/text/caption'
import Label from '~/components/label'
import Cross from '~/components/icons/x'
import Link from '~/components/text/link'
import Heading from '~/components/text/linked-heading'
import Text, { H2, H3 } from '~/components/text'
import Center from '~/components/layout/center'
import styles from './deploy-button-generator.module.css'
import HR from '~/components/text/hr'

function validateURL(str) {
  var pattern = new RegExp(
    '^(https?:\\/\\/)?' + // protocol
    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
    '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
    '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
    '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
      '(\\#[-a-z\\d_]*)?$',
    'i'
  ) // fragment locator
  return !!pattern.test(str)
}

const generateId = () =>
  Math.random()
    .toString(36)
    .split('.')[1]

export default function DeployButtonGenerator() {
  const defaultRepo =
    'https://github.com/vercel/next.js/tree/canary/examples/hello-world'
  const [selected, setSelected] = useState('markdown')
  const [repository, setRepository] = useState(defaultRepo)
  const [repositoryError, setRepositoryError] = useState('')
  const [env, setEnv] = useState([{ value: '', id: generateId(), error: '' }])
  const [envError, setEnvError] = useState('')
  const [envDescription, setEnvDescription] = useState('')
  const [envDescriptionError, setEnvDescriptionError] = useState('')
  const [envLink, setEnvLink] = useState('')
  const [envLinkError, setEnvLinkError] = useState('')
  const [redirectUrl, setRedirectUrl] = useState('')
  const [redirectUrlError, setRedirectUrlError] = useState('')
  const [developerId, setDeveloperId] = useState('')
  const [developerIdError, setDeveloperIdError] = useState('')
  const [projectName, setProjectName] = useState('')
  const [projectNameError, setProjectNameError] = useState('')
  const [repoName, setRepoName] = useState('')
  const [repoNameError, setRepoNameError] = useState('')
  const isAmp = useAmp()
  const importUrl = 'https://vercel.com/import/git'

  const onRepositoryChange = event => {
    const newRepo = event.target.value

    if (newRepo.length >= 1 && !validateURL(newRepo)) {
      setRepositoryError('The Git Repository must be a valid URL.')
    } else if (
      newRepo.length >= 1 &&
      validateURL(newRepo) &&
      !newRepo.includes('github.com') &&
      !newRepo.includes('bitbucket.com') &&
      !newRepo.includes('gitlab.com')
    ) {
      setRepositoryError(
        'The Git Repository must be a URL for a repository on GitHub, Bitbucket, or GitLab.'
      )
    } else {
      setRepositoryError('')
      setRepository(newRepo)
    }
  }

  const handleAddEnv = event => {
    event.preventDefault()

    if (env.length === 100) {
      setEnvError(
        'There cannot be more than 100 Environment Variables per project.'
      )
      return
    }

    setEnv([...env, { value: '', id: generateId() }])
  }

  const handleRemoveEnv = (index, event) => {
    event.preventDefault()
    let newEnvs = [...env]
    newEnvs.splice(index, 1)
    setEnv(newEnvs)
  }

  const handleChangeEnv = (index, value) => {
    let newEnvs = [...env]
    if (value.length > 256) {
      newEnvs[index].error =
        'Environment Variable keys cannot be longer than 256 characters.'
    } else if (value.length >= 1 && !/^[a-zA-Z][a-zA-Z0-9_]*$/.test(value)) {
      newEnvs[index].error =
        'Environment Variable keys must start with a letter and use no special characters other than underscores ("_").'
    } else {
      newEnvs[index].error = ''
    }

    newEnvs[index].value = value
    setEnv(newEnvs)
  }

  const handleEnvDescChange = event => {
    if (hasEnv && event.target.value.length > 256) {
      setEnvDescriptionError(
        'The Environment Variables description must be 256 characters or less.'
      )
    } else {
      setEnvDescriptionError('')
      setEnvDescription(event.target.value)
    }
  }

  const handleEnvLinkChange = event => {
    const newEnvLink = event.target.value

    if (
      hasEnv &&
      envDescription !== '' &&
      newEnvLink.length >= 1 &&
      !validateURL(newEnvLink)
    ) {
      setEnvLinkError('Environment Variable external link must be a valid URL.')
    } else {
      setEnvLinkError('')
      setEnvLink(newEnvLink)
    }
  }

  const handleProjectNameChange = event => {
    const newProjectName = event.target.value
    if (newProjectName.length > 100) {
      setProjectNameError('A Project name cannot be longer than 100 characters')
    } else if (
      newProjectName.length >= 1 &&
      !/^[a-z0-9]([a-z0-9]|-[a-z0-9])*$/.test(newProjectName)
    ) {
      setProjectNameError(
        'Project names must be lowercase, start and end with a letter, and cannot contain special characters other than a hyphen ("-").'
      )
    } else {
      setProjectNameError('')
      setProjectName(newProjectName)
    }
  }

  const handleRepoNameChange = event => {
    const newRepoName = event.target.value
    if (newRepoName.length > 100) {
      setRepoNameError(
        'A Git repository name cannot be longer than 100 characters'
      )
    } else if (
      newRepoName.length >= 1 &&
      !/^[A-Za-z0-9_.-]+$/.test(newRepoName)
    ) {
      setRepoNameError(
        'Git repository names cannot include special characters other than a hyphen ("-"), underscore ("_"), or full-stop (".").'
      )
    } else {
      setRepoNameError('')
      setRepoName(newRepoName)
    }
  }

  const handleRedirectURLChange = event => {
    const newRedirectURL = event.target.value
    if (newRedirectURL.length >= 1 && !validateURL(newRedirectURL)) {
      setRedirectUrlError('Redirect URL must be a valid URL.')
    } else {
      setRedirectUrlError('')
      setRedirectUrl(newRedirectURL)
    }
  }

  const handleDeveloperIDChange = event => {
    setDeveloperId(event.target.value)
  }

  const filteredEnv = env.filter(envVar => envVar.value !== '')
  const hasEnv = filteredEnv.length !== 0
  const envValues = filteredEnv.map(envVar => envVar.value).toString()

  useEffect(() => {
    setEnvError('')

    if (hasEnv === false && envLink !== '') {
      setEnvLinkError(
        'An Environment Variable Link needs Required Environment Variables.'
      )
    } else if (hasEnv && envDescription === '' && envLink !== '') {
      setEnvLinkError(
        'An Environment Variable Link requires an Environment Variables Description.'
      )
    } else {
      setEnvLinkError('')
    }

    if (hasEnv === false && envDescription !== '') {
      setEnvDescriptionError(
        'An Environment Variable Link needs Required Environment Variables.'
      )
    } else {
      setEnvDescriptionError('')
    }
  }, [env, envDescription, envLink])

  useEffect(() => {
    if (redirectUrl === '' && developerId !== '') {
      setDeveloperIdError('A Developer ID requires an Redirect URL.')
    } else {
      setDeveloperIdError('')
    }
  }, [redirectUrl, developerId])

  const completeUrl = `${importUrl}?s=${encodeURIComponent(
    repository || defaultRepo
  )}${hasEnv ? `&env=${envValues}` : ''}${
    hasEnv && envDescription
      ? `&envDescription=${encodeURIComponent(envDescription)}`
      : ''
  }${hasEnv && envDescription && envLink ? `&envLink=${envLink}` : ''}${
    projectName ? `&project-name=${encodeURIComponent(projectName)}` : ''
  }${repoName ? `&repo-name=${encodeURIComponent(repoName)}` : ''}${
    redirectUrl ? `&redirect-url=${encodeURIComponent(redirectUrl)}` : ''
  }${developerId ? `&developer-id=${developerId}` : ''}`

  const completeHTMLUrl = (
    <span>
      {importUrl}?<b>s={encodeURIComponent(repository || defaultRepo)}</b>
      {hasEnv ? (
        <>
          &amp;<b>env={envValues}</b>
        </>
      ) : null}
      {hasEnv && envDescription ? (
        <>
          &amp;<b>envDescription={encodeURIComponent(envDescription)}</b>
        </>
      ) : null}
      {hasEnv && envDescription && envLink ? (
        <>
          &amp;<b>envLink={envLink}</b>
        </>
      ) : null}
      {projectName ? (
        <>
          &amp;<b>project-name={encodeURIComponent(projectName)}</b>
        </>
      ) : null}
      {repoName ? (
        <>
          &amp;<b>repository-name={encodeURIComponent(repoName)}</b>
        </>
      ) : null}
      {redirectUrl ? (
        <>
          &amp;<b>redirect-url={encodeURIComponent(redirectUrl)}</b>
        </>
      ) : null}
      {developerId ? (
        <>
          &amp;<b>developer-id={developerId}</b>
        </>
      ) : null}
    </span>
  )

  return (
    <>
      {!isAmp && (
        <>
          <Center>
            <Link href={completeUrl}>
              <img src="https://vercel.com/button" width={104} height={36} />
            </Link>
          </Center>
          <Caption>
            An example Deploy Button using the following{' '}
            <Link href="#snippets">HTML snippet</Link>.
          </Caption>
        </>
      )}

      <Heading lean offsetTop={175}>
        <H2>Snippets</H2>
      </Heading>

      <Text>
        Use the following Deploy Button snippets in your templates to help users
        get started with their projects by cloning and deploying from a Git
        repository.
      </Text>

      <Tabs
        tabs={[
          { title: 'Markdown', value: 'markdown' },
          { title: 'HTML', value: 'html' },
          { title: 'URL', value: 'url' }
        ]}
        selected={selected}
        setSelected={setSelected}
      />

      {selected === 'url' && (
        <div className={styles.urlTab}>
          <Snippet
            width="100%"
            dark
            prompt={false}
            copyText={completeUrl}
            text={completeHTMLUrl}
          />
          <Caption>A Deploy Button source URL.</Caption>
        </div>
      )}

      {selected === 'markdown' && (
        <div className={styles.urlTab}>
          <Snippet
            width="100%"
            dark
            prompt={false}
            copyText={`[![Deploy with Vercel](https://vercel.com/button)](${completeUrl})`}
            text={
              <>
                [![Deploy with Vercel](https://vercel.com/button)](
                {completeHTMLUrl})
              </>
            }
          />
          <Caption>
            A Markdown snippet that shows a linked Deploy Button.
          </Caption>
        </div>
      )}

      {selected === 'html' && (
        <div className={styles.urlTab}>
          <Snippet
            width="100%"
            dark
            prompt={false}
            copyText={`<a href="${completeUrl}"><img src="https://vercel.com/button" alt="Deploy with Vercel"/></a>`}
            text={
              <span>
                {`<a href="`}
                {completeHTMLUrl}
                {`"><img src="https://vercel.com/button" alt="Deploy with Vercel"/></a>`}
              </span>
            }
          />
          <Caption>A HTML snippet that shows a linked Deploy Button.</Caption>
        </div>
      )}

      <Heading lean offsetTop={175}>
        <H3>Generate Your Own</H3>
      </Heading>

      <Text>
        Use the following generator to configure the Deploy Button URL,
        generated in the above snippet.
      </Text>

      <Text>
        Start with the public template repository URL from GitHub, GitLab, or
        Bitbucket you want to use as a source for users to clone and deploy.
      </Text>

      <div className={styles.settingsForm}>
        <div className={styles.settingsSection}>
          <Container>
            <Clearable
              placeholder={defaultRepo}
              width="100%"
              label="Git Repository"
              onChange={onRepositoryChange}
              error={repositoryError}
            />
          </Container>

          <Spacer />
          <Text small>
            <Link href="#repository-url">
              Learn more about the Git Repository URL parameter
            </Link>
            .
          </Text>
        </div>

        <div className={styles.settingsSection}>
          <Details title="Environment Variables">
            <Text id="env-description">
              Define Environment Variable Keys that requires the user to fill in
              values for what the app needs to run.
            </Text>
            <Spacer />
            <Label value="Environment Variables Keys" elId="env-label" />
            <div aria-describedby="env-description" aria-labelledby="env-label">
              {env.map((envVar, index) => (
                <>
                  <div className={styles.envRow} key={envVar.id}>
                    <div className={styles.envInput}>
                      <Input
                        placeholder="MY_API_KEY"
                        width="100%"
                        value={envVar.value}
                        error={envVar.error}
                        onChange={event =>
                          handleChangeEnv(index, event.target.value)
                        }
                      />
                    </div>
                    <Spacer x={0.5} />
                    <Button
                      disabled={env.length === 1}
                      type="secondary"
                      width={40}
                      icon={<Cross />}
                      iconOffset={13}
                      onClick={event => handleRemoveEnv(index, event)}
                    />
                  </div>
                  <Spacer />
                </>
              ))}
              {envError && (
                <>
                  <ErrorMessage style={{ width: '100%' }}>
                    {envError}
                  </ErrorMessage>
                  <Spacer />
                </>
              )}

              <Button onClick={handleAddEnv}>Add Environment Variable</Button>
            </div>
            <Spacer />
            <Text small>
              <Link href="#required-environment-variables">
                Learn more about the Environment Variable parameters
              </Link>
              .
            </Text>
            <HR spacing={24} />
            <Text id="env-description">
              Add additional information through a description and link to
              documentation that helps users understand what they are filling
              Environment Variables for.
            </Text>
            <Spacer />
            <Input
              label="Environment Variables Description"
              placeholder="Enter your API Keys to deploy"
              onChange={handleEnvDescChange}
              error={envDescriptionError}
            />
            <Spacer />
            <Input
              label="Environment Variables Link"
              placeholder="https://myheadlessproject.com/docs/env-vars"
              onChange={handleEnvLinkChange}
              error={envLinkError}
            />
          </Details>
        </div>

        <div className={styles.settingsSection}>
          <Details title="Defaults">
            <Text>
              If you're setting up a project on behalf of the user and already
              know what name the user likely wants, enter a default project
              name. Additionally fill this is for the repository name.
            </Text>
            <Input
              label="Default Project Name"
              placeholder="my-awesome-project"
              onChange={handleProjectNameChange}
              error={projectNameError}
            />
            <Spacer />
            <Input
              label="Default Git Repository Name"
              placeholder="my-awesome-project"
              onChange={handleRepoNameChange}
              error={repoNameError}
            />
          </Details>
        </div>

        <div className={styles.settingsSection}>
          <Details title="Redirect">
            <Text>
              The Redirect URL parameter allows you to redirect the user back to
              your platform on the event of a successful deployment.
            </Text>
            <Input
              label="Redirect URL"
              placeholder="https://myheadlessproject.com"
              onChange={handleRedirectURLChange}
              error={redirectUrlError}
            />
            <Spacer />
            <Text small>
              <Link href="#redirect-url">
                Learn more about the Redirect URL parameter
              </Link>
              , including information Vercel passes on.
            </Text>
            <HR spacing={16} />
            <Text>
              Set a Developer ID to show a logo and name from an{' '}
              <Link href="/docs/integrations">Integration</Link> by using its
              Client ID, found in the Integration Developer Console.
            </Text>
            <Input
              label="Developer ID"
              placeholder="oac_7rUTiCMow23Gyfao9RQQ3Es2"
              onChange={handleDeveloperIDChange}
              error={developerIdError}
            />
            <Spacer />
            <Text small>
              <Link href="#developer-id">
                Learn more about the Developer ID parameter
              </Link>
              .
            </Text>
          </Details>
        </div>
      </div>
    </>
  )
}

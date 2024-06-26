import React from 'react'
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import Header from '@/components/Header'
import OrganizationLayout from '@/components/OrganizationLayout'
import ClusterOverview from '@/pages/Cluster/Overview'
import { useCurrentThemeType } from '@/hooks/useCurrentThemeType'
import { IThemedStyleProps } from '@/interfaces/IThemedStyle'
import { useStyletron } from 'baseui'
import { createUseStyles } from 'react-jss'
import Login from '@/pages/yeti/Login'
import OrganizationApiTokens from '@/pages/Organization/ApiTokens'
import OrganizationClusters from '@/pages/Organization/Clusters'
import OrganizationUsers from '@/pages/Organization/Users'
import OrganizationMembers from '@/pages/Organization/Members'
import OrganizationDeployments from '@/pages/Organization/Deployments'
import OrganizationDeploymentForm from '@/pages/Organization/DeploymentForm'
import OrganizationSettings from '@/pages/Organization/Settings'
import ClusterDeployments from '@/pages/Cluster/Deployments'
import ClusterMembers from '@/pages/Cluster/Members'
import ClusteryetiComponents from '@/pages/Cluster/yetiComponents'
import ClusterSettings from '@/pages/Cluster/Settings'
import ClusterLayout from '@/components/ClusterLayout'
import OrganizationmlRepositories from '@/pages/Organization/mlRepositories'
import Organizationmls from '@/pages/Organization/mls'
import OrganizationModels from '@/pages/Organization/Models'
import OrganizationEvents from '@/pages/Organization/Events'
import mlRepositoryOverview from '@/pages/mlRepository/Overview'
import mlRepositorymls from '@/pages/mlRepository/mls'
import DeploymentOverview from '@/pages/Deployment/Overview'
import DeploymentRevisions from '@/pages/Deployment/Revisions'
import DeploymentTerminalRecordPlayer from '@/pages/Deployment/TerminalRecordPlayer'
import DeploymentReplicas from '@/pages/Deployment/Replicas'
import DeploymentLog from '@/pages/Deployment/Log'
import DeploymentMonitor from '@/pages/Deployment/Monitor'
import DeploymentEdit from '@/pages/Deployment/Edit'
import DeploymentRevisionRollback from '@/pages/Deployment/RevisionRollback'
import mlRepositoryLayout from '@/components/mlRepositoryLayout'
import DeploymentLayout from '@/components/DeploymentLayout'
import ModelRepositoryLayout from '@/components/ModelRepositoryLayout'
import ModelRepositoryOverview from '@/pages/ModelRepository/Overview'
import ModelRepositoryModels from '@/pages/ModelRepository/Models'
import OrganizationModelRepositories from '@/pages/Organization/ModelRepositories'
import { ChatWidget } from '@papercups-io/chat-widget'
import ModelLayout from '@/components/ModelLayout'
import ModelOverview from '@/pages/Model/Overview'
import mlLayout from '@/components/mlLayout'
import mlOverview from '@/pages/ml/Overview'
import mlRepositoryDeployments from '@/pages/mlRepository/Deployments'
import Home from '@/pages/yeti/Home'
import Setup from '@/pages/yeti/Setup'

const useStyles = createUseStyles({
    'root': ({ theme }: IThemedStyleProps) => ({
        '& path': {
            stroke: theme.colors.contentPrimary,
        },
        ...Object.entries(theme.colors).reduce((p: Record<string, string>, [k, v]) => {
            return {
                ...p,
                [`--color-${k}`]: v,
            }
        }, {} as Record<string, string>),
    }),
    '@global': {
        '.react-lazylog': {
            background: 'var(--color-backgroundPrimary)',
        },
        '.react-lazylog-searchbar': {
            background: 'var(--color-backgroundPrimary)',
        },
        '.react-lazylog-searchbar-input': {
            background: 'var(--color-backgroundPrimary)',
        },
    },
})

const Routes = () => {
    const themeType = useCurrentThemeType()
    const [, theme] = useStyletron()
    const styles = useStyles({ theme, themeType })

    return (
        <BrowserRouter>
            <div
                className={styles.root}
                style={{
                    minHeight: '100vh',
                    background: themeType === 'light' ? '#fdfdfd' : theme.colors.backgroundSecondary,
                    color: theme.colors.contentPrimary,
                }}
            >
                <Header />
                <Switch>
                    <Route exact path='/ml_repositories/:mlRepositoryName/mls/:mlVersion/:path?/:path?'>
                        <mlLayout>
                            <Switch>
                                <Route
                                    exact
                                    path='/ml_repositories/:mlRepositoryName/mls/:mlVersion'
                                    component={mlOverview}
                                />
                            </Switch>
                        </mlLayout>
                    </Route>
                    <Route exact path='/ml_repositories/:mlRepositoryName/:path?/:path?'>
                        <mlRepositoryLayout>
                            <Switch>
                                <Route
                                    exact
                                    path='/ml_repositories/:mlRepositoryName'
                                    component={mlRepositoryOverview}
                                />
                                <Route
                                    exact
                                    path='/ml_repositories/:mlRepositoryName/mls'
                                    component={mlRepositorymls}
                                />
                                <Route
                                    exact
                                    path='/ml_repositories/:mlRepositoryName/deployments'
                                    component={mlRepositoryDeployments}
                                />
                            </Switch>
                        </mlRepositoryLayout>
                    </Route>
                    <Route
                        exact
                        path='/clusters/:clusterName/namespaces/:kubeNamespace/deployments/:deploymentName/:path?/edit'
                    >
                        <OrganizationLayout>
                            <Route
                                exact
                                path='/clusters/:clusterName/namespaces/:kubeNamespace/deployments/:deploymentName/edit'
                                component={DeploymentEdit}
                            />
                        </OrganizationLayout>
                    </Route>
                    <Route
                        exact
                        path='/clusters/:clusterName/namespaces/:kubeNamespace/deployments/:deploymentName/:path?/revisions/:path?/rollback'
                    >
                        <OrganizationLayout>
                            <Route
                                exact
                                path='/clusters/:clusterName/namespaces/:kubeNamespace/deployments/:deploymentName/revisions/:revisionUid/rollback'
                                component={DeploymentRevisionRollback}
                            />
                        </OrganizationLayout>
                    </Route>
                    <Route
                        exact
                        path='/clusters/:clusterName/namespaces/:kubeNamespace/deployments/:deploymentName/:path?/:path?'
                    >
                        <DeploymentLayout>
                            <Switch>
                                <Route
                                    exact
                                    path='/clusters/:clusterName/namespaces/:kubeNamespace/deployments/:deploymentName'
                                    component={DeploymentOverview}
                                />
                                <Route
                                    exact
                                    path='/clusters/:clusterName/namespaces/:kubeNamespace/deployments/:deploymentName/revisions'
                                    component={DeploymentRevisions}
                                />
                                <Route
                                    exact
                                    path='/clusters/:clusterName/namespaces/:kubeNamespace/deployments/:deploymentName/replicas'
                                    component={DeploymentReplicas}
                                />
                                <Route
                                    exact
                                    path='/clusters/:clusterName/namespaces/:kubeNamespace/deployments/:deploymentName/log'
                                    component={DeploymentLog}
                                />
                                <Route
                                    exact
                                    path='/clusters/:clusterName/namespaces/:kubeNamespace/deployments/:deploymentName/monitor'
                                    component={DeploymentMonitor}
                                />
                                <Route
                                    exact
                                    path='/clusters/:clusterName/namespaces/:kubeNamespace/deployments/:deploymentName/terminal_records/:uid'
                                    component={DeploymentTerminalRecordPlayer}
                                />
                            </Switch>
                        </DeploymentLayout>
                    </Route>
                    <Route exact path='/clusters/:clusterName/:path?/:path?'>
                        <ClusterLayout>
                            <Switch>
                                <Route exact path='/clusters/:clusterName' component={ClusterOverview} />
                                <Route exact path='/clusters/:clusterName/deployments' component={ClusterDeployments} />
                                <Route exact path='/clusters/:clusterName/members' component={ClusterMembers} />
                                <Route exact path='/clusters/:clusterName/settings' component={ClusterSettings} />
                                <Route
                                    exact
                                    path='/clusters/:clusterName/yeti_components'
                                    component={ClusteryetiComponents}
                                />
                            </Switch>
                        </ClusterLayout>
                    </Route>
                    <Route exact path='/model_repositories/:modelRepositoryName/models/:modelVersion/:path?/:path?'>
                        <ModelLayout>
                            <Switch>
                                <Route
                                    exact
                                    path='/model_repositories/:modelRepositoryName/models/:modelVersion'
                                    component={ModelOverview}
                                />
                            </Switch>
                        </ModelLayout>
                    </Route>
                    <Route exact path='/model_repositories/:modelRepositoryName/:path?/:path?'>
                        <ModelRepositoryLayout>
                            <Switch>
                                <Route
                                    exact
                                    path='/model_repositories/:modelRepositoryName'
                                    component={ModelRepositoryOverview}
                                />
                                <Route
                                    exact
                                    path='/model_repositories/:modelRepositoryName/models'
                                    component={ModelRepositoryModels}
                                />
                            </Switch>
                        </ModelRepositoryLayout>
                    </Route>
                    <Route exact path='/login' component={Login} />
                    <Route exact path='/setup' component={Setup} />
                    <Route>
                        <OrganizationLayout>
                            <Switch>
                                <Route exact path='/' component={Home} />
                                <Route exact path='/mls' component={Organizationmls} />
                                <Route exact path='/models' component={OrganizationModels} />
                                <Route exact path='/events' component={OrganizationEvents} />
                                <Route exact path='/api_tokens' component={OrganizationApiTokens} />
                                <Route exact path='/clusters' component={OrganizationClusters} />
                                <Route exact path='/users' component={OrganizationUsers} />
                                <Route exact path='/members' component={OrganizationMembers} />
                                <Route exact path='/ml_repositories' component={OrganizationmlRepositories} />
                                <Route exact path='/model_repositories' component={OrganizationModelRepositories} />
                                <Route exact path='/deployments' component={OrganizationDeployments} />
                                <Route exact path='/new_deployment' component={OrganizationDeploymentForm} />
                                <Route exact path='/settings' component={OrganizationSettings} />
                            </Switch>
                        </OrganizationLayout>
                    </Route>
                </Switch>
                <ChatWidget
                    token='bd772f05-a51b-4647-99a9-5d6f24de1999'
                    inbox='adc8d598-4fa9-4aae-9879-96867a838314'
                    title='Welcome to yeti👋 👋 👋'
                    subtitle='Ask us questions or give us feedback - we will reply ASAP!😊'
                    primaryColor='#47AFD1'
                    newMessagePlaceholder='Start typing...'
                    showAgentAvailability={false}
                    agentAvailableText='We are online right now!'
                    agentUnavailableText='We are away at the moment.'
                    requireEmailUpfront={false}
                    iconVariant='outlined'
                    baseUrl='https://yeti-community-papercups.herokuapp.com'
                    // Optionally include data about your customer here to identify them
                    // customer={{
                    //   name: __CUSTOMER__.name,
                    //   email: __CUSTOMER__.email,
                    //   external_id: __CUSTOMER__.id,
                    //   metadata: {
                    //     plan: "premium"
                    //   }
                    // }}
                />
            </div>
        </BrowserRouter>
    )
}

export default Routes

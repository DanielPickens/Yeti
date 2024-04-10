import Card from '@/components/Card'
import KubeResourcePodStatuses from '@/components/KubeResourcePodStatuses'
import Table from '@/components/Table'
import Time from '@/components/Time'
import yetiComponentTypeRender from '@/components/yetiComponentTypeRender'
import { resourceIconMapping } from '@/consts'
import { useFetchyetiComponents } from '@/hooks/useFetchyetiComponents'
import useTranslation from '@/hooks/useTranslation'
import { yetiComponentType } from '@/schemas/yeti_component'
import { useStyletron } from 'baseui'
import { StatefulTooltip } from 'baseui/tooltip'
import { useParams } from 'react-router-dom'

export default function ClusteryetiComponents() {
    const { clusterName } = useParams<{ clusterName: string }>()
    const { yetiComponentsInfo } = useFetchyetiComponents(clusterName)

    const [t] = useTranslation()
    const [, theme] = useStyletron()

    return (
        <Card title={t('yeti components')} titleIcon={resourceIconMapping.yeti_component}>
            <Table
                isLoading={yetiComponentsInfo.isLoading}
                columns={[t('name'), 'Pods', t('version'), t('installed_at'), t('status')]}
                data={
                    yetiComponentsInfo.data?.map((component) => {
                        let status: 'healthy' | 'unhealthy' = 'unhealthy'
                        if (component.latest_heartbeat_at) {
                            const lastHeartbeat = new Date(component.latest_heartbeat_at).getTime()
                            const now = new Date().getTime()
                            if (now - lastHeartbeat < 60000 * 6) {
                                status = 'healthy'
                            }
                        }
                        return [
                            <yetiComponentTypeRender
                                key={component.name}
                                type={component.name as yetiComponentType}
                            />,
                            <KubeResourcePodStatuses
                                key={component.uid}
                                clusterName={clusterName}
                                resource={{
                                    api_version: 'v1',
                                    kind: 'Deployment',
                                    name: 'deployment',
                                    namespace: component.kube_namespace,
                                    match_labels: component.manifest?.selector_labels ?? {},
                                }}
                            />,
                            component.version,
                            <Time key={component.uid} time={component.latest_installed_at ?? ''} />,
                            status === 'unhealthy' ? (
                                <StatefulTooltip content={t('yeti component unhealthy reason desc')}>
                                    <span
                                        style={{
                                            color: theme.colors.negative,
                                        }}
                                    >
                                        {t(status)}
                                    </span>
                                </StatefulTooltip>
                            ) : (
                                <span
                                    style={{
                                        color: theme.colors.positive,
                                    }}
                                >
                                    {t(status)}
                                </span>
                            ),
                        ]
                    }) ?? []
                }
            />
        </Card>
    )
}

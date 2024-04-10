import React, { useState } from 'react'
import { useml, usemlLoading } from '@/hooks/useml'
import { Skeleton } from 'baseui/skeleton'
import { createUseStyles } from 'react-jss'
import useTranslation from '@/hooks/useTranslation'
import { listmlModels, listmlDeployments, updateml } from '@/services/ml'
import LabelList from '@/components/LabelList'
import Card from '@/components/Card'
import Time from '@/components/Time'
import User from '@/components/User'
import prettyBytes from 'pretty-bytes'
import { useParams } from 'react-router-dom'
import { useFetchml } from '@/hooks/useFetchml'
import { resourceIconMapping } from '@/consts'
import { useQuery } from 'react-query'
import { IListQuerySchema } from '@/schemas/list'
import qs from 'qs'
import { AiOutlineCloudDownload, AiOutlineTags } from 'react-icons/ai'
import SyntaxHighlighter from 'react-syntax-highlighter'
import { TiClipboard } from 'react-icons/ti'
import { Button } from 'baseui/button'
import CopyToClipboard from 'react-copy-to-clipboard'
import { docco, dark } from 'react-syntax-highlighter/dist/esm/styles/hljs'
import { Notification } from 'baseui/notification'
import List from '@/components/List'
import { IDeploymentSchema } from '@/schemas/deployment'
import DeploymentStatusTag from '@/components/DeploymentStatusTag'
import { useStyletron } from 'baseui'
import { useCurrentThemeType } from '@/hooks/useCurrentThemeType'
import ModelList from '@/components/ModelList'
import { IThemedStyleProps } from '@/interfaces/IThemedStyle'
import Link from '@/components/Link'
import classNames from 'classnames'
import Table from '@/components/Table'
import { useOrganization } from '@/hooks/useOrganization'

const useStyles = createUseStyles({
    left: {
        flexGrow: 1,
        flexShrink: 0,
    },
    right: {
        flexGrow: 1,
        flexShrink: 0,
    },
    itemsWrapper: {
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
    },
    item: {
        display: 'flex',
        alignItems: 'center',
        gap: 12,
    },
    deploymentItem: (props: IThemedStyleProps) => ({
        'padding': '6px 2px',
        'cursor': 'pointer',
        'display': 'flex',
        'alignItems': 'center',
        'gap': 12,
        'borderBottom': `1px solid ${props.theme.borders.border100.borderColor}`,
        '&:hover': {
            backgroundColor: props.theme.colors.backgroundSecondary,
        },
    }),
    key: {
        'flexShrink': 0,
        'display': 'flex',
        'alignItems': 'center',
        'fontWeight': 500,
        'gap': 6,
        '&:after': {
            content: '":"',
        },
    },
    value: {
        width: '100%',
    },
    foldedItem: {
        'alignItems': 'flex-start !important',
        '& $key': {
            cursor: 'pointer',
        },
    },
    closedItem: {
        '& > $key': {
            '&:before': {
                content: '"▲"',
            },
        },
    },
    openedItem: {
        '& > $key': {
            '&:before': {
                content: '"▼"',
            },
        },
    },
})

export default function mlOverview() {
    const themeType = useCurrentThemeType()
    const [, theme] = useStyletron()
    const styles = useStyles({ theme, themeType })
    const { mlRepositoryName, mlVersion } = useParams<{ mlRepositoryName: string; mlVersion: string }>()
    const mlInfo = useFetchml(mlRepositoryName, mlVersion)
    const { ml } = useml()
    const { mlLoading } = usemlLoading()
    const [t] = useTranslation()
    const { organization } = useOrganization()
    const modelsQueryKey = `ml:${organization?.name}:${mlRepositoryName}/${mlVersion}:models`
    const modelsInfo = useQuery(modelsQueryKey, () => listmlModels(mlRepositoryName, mlVersion))
    const [deploymentsQuery, setDeploymentsQuery] = useState<IListQuerySchema>({
        start: 0,
        count: 10,
    })
    const deploymentsQueryKey = `ml:${
        organization?.name
    }:${mlRepositoryName}/${mlVersion}:deployments:${qs.stringify(deploymentsQuery)}`
    const deploymentsInfo = useQuery(deploymentsQueryKey, () =>
        listmlDeployments(mlRepositoryName, mlVersion, deploymentsQuery)
    )
    const downloadCommand = `mlml pull ${mlRepositoryName}:${mlVersion}`
    const [copyNotification, setCopyNotification] = useState<string>()
    const highlightTheme = themeType === 'dark' ? dark : docco
    const [showRunners, setShowRunners] = useState(false)

    if (mlLoading || !ml) {
        return <Skeleton rows={3} animation />
    }

    return (
        <div
            style={{
                display: 'grid',
                gap: 20,
                gridTemplateColumns: '1fr 1fr',
            }}
        >
            <div className={styles.left}>
                <Card>
                    <div className={styles.itemsWrapper}>
                        <div className={styles.item}>
                            <div className={styles.key}>{t('created_at')}</div>
                            <div className={styles.value}>
                                <Time time={ml.created_at} />
                            </div>
                        </div>
                        <div className={styles.item}>
                            <div className={styles.key}>{t('user')}</div>
                            <div className={styles.value}>{ml.creator ? <User user={ml.creator} /> : '-'}</div>
                        </div>
                        <div className={styles.item}>
                            <div className={styles.key}>mlML Version</div>
                            <div className={styles.value}>{ml.manifest.mlml_version}</div>
                        </div>
                        <div className={styles.item}>
                            <div className={styles.key}>Size</div>
                            <div className={styles.value}>{prettyBytes(ml.manifest.size_bytes)}</div>
                        </div>
                        <div
                            className={classNames({
                                [styles.item]: true,
                                [styles.foldedItem]: true,
                                [styles.closedItem]: !showRunners,
                                [styles.openedItem]: showRunners,
                            })}
                        >
                            <div
                                className={styles.key}
                                role='button'
                                tabIndex={0}
                                onClick={() => setShowRunners((v) => !v)}
                            >
                                Runners
                            </div>
                            <div className={styles.value}>
                                {showRunners ? (
                                    <Table
                                        preventAutoClickFirstLink
                                        size='compact'
                                        columns={[t('name'), t('type'), t('models'), t('resource config')]}
                                        data={(ml.manifest.runners || []).map((runner) => [
                                            runner.name,
                                            runner.runnable_type,
                                            <ModelList
                                                key={runner.name}
                                                size='small'
                                                isLoading={false}
                                                isListItem={false}
                                                models={(modelsInfo.data || []).filter(
                                                    (model_) =>
                                                        (runner.models || []).indexOf(
                                                            `${model_.repository.name}:${model_.version}`
                                                        ) >= 0
                                                )}
                                                queryKey={modelsQueryKey}
                                            />,
                                            runner.resource_config ? (
                                                <SyntaxHighlighter language='json' style={highlightTheme}>
                                                    {JSON.stringify(runner.resource_config, null, 2)}
                                                </SyntaxHighlighter>
                                            ) : undefined,
                                        ])}
                                    />
                                ) : (
                                    '...'
                                )}
                            </div>
                        </div>
                    </div>
                </Card>
            </div>
            <div className={styles.right}>
                <Card title={t('download')} titleIcon={AiOutlineCloudDownload}>
                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'flex-start',
                            gap: 10,
                        }}
                    >
                        <div
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                flexGrow: 1,
                            }}
                        >
                            <SyntaxHighlighter
                                language='bash'
                                style={highlightTheme}
                                customStyle={{
                                    margin: 0,
                                }}
                            >
                                {downloadCommand}
                            </SyntaxHighlighter>
                            {copyNotification && (
                                <Notification
                                    closeable
                                    onClose={() => setCopyNotification(undefined)}
                                    kind='positive'
                                    overrides={{
                                        Body: {
                                            style: {
                                                margin: 0,
                                                width: '100%',
                                                boxSizing: 'border-box',
                                                padding: '8px !important',
                                                borderRadius: '3px !important',
                                                fontSize: '13px !important',
                                            },
                                        },
                                    }}
                                >
                                    {copyNotification}
                                </Notification>
                            )}
                        </div>
                        <div style={{ flexShrink: 0 }}>
                            <CopyToClipboard
                                text={downloadCommand}
                                onCopy={() => {
                                    setCopyNotification(t('copied to clipboard'))
                                }}
                            >
                                <Button startEnhancer={<TiClipboard size={14} />} kind='secondary' size='compact'>
                                    {t('copy')}
                                </Button>
                            </CopyToClipboard>
                        </div>
                    </div>
                </Card>
                <Card title={t('labels')} titleIcon={AiOutlineTags}>
                    <LabelList
                        value={ml.labels}
                        onChange={async (labels) => {
                            await updateml(ml.repository.name, ml.version, {
                                ...ml,
                                labels,
                            })
                            await mlInfo.refetch()
                        }}
                    />
                </Card>
                <Card title={t('models')} titleIcon={resourceIconMapping.ml}>
                    <ModelList
                        isLoading={modelsInfo.isLoading}
                        isListItem={false}
                        models={modelsInfo.data ?? []}
                        queryKey={modelsQueryKey}
                    />
                </Card>
                <Card title={t('deployments')} titleIcon={resourceIconMapping.deployment}>
                    <List
                        isLoading={deploymentsInfo.isLoading}
                        items={deploymentsInfo.data?.items ?? []}
                        paginationProps={{
                            start: deploymentsQuery.start,
                            count: deploymentsQuery.count,
                            total: deploymentsInfo.data?.total ?? 0,
                            onPageChange: (page) => {
                                setDeploymentsQuery({
                                    ...deploymentsQuery,
                                    start: (page - 1) * deploymentsQuery.count,
                                })
                            },
                        }}
                        onRenderItem={(item: IDeploymentSchema) => {
                            return (
                                <div
                                    className={styles.deploymentItem}
                                    onClick={(e: React.MouseEvent) => {
                                        e.currentTarget.querySelector('a')?.click()
                                    }}
                                    role='button'
                                    tabIndex={0}
                                >
                                    <div
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            width: '100%',
                                            gap: 10,
                                        }}
                                    >
                                        <DeploymentStatusTag size='small' status={item.status} />
                                        <div
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'space-between',
                                                flexGrow: 1,
                                            }}
                                        >
                                            <Link
                                                href={`/clusters/${item.cluster?.name}/namespaces/${item.kube_namespace}/deployments/${item.name}`}
                                            >
                                                {item.name}
                                            </Link>
                                            <Time time={item.created_at} />
                                        </div>
                                    </div>
                                </div>
                            )
                        }}
                    />
                </Card>
            </div>
        </div>
    )
}
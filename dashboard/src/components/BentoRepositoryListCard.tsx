import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useQuery, useQueryClient } from 'react-query'
import Card from '@/components/Card'
import { listmlRepositories } from '@/services/ml_repository'
import { usePage } from '@/hooks/usePage'
import { ImlRepositoryWithLatestDeploymentsSchema } from '@/schemas/ml_repository'
import useTranslation from '@/hooks/useTranslation'
import { Button, SIZE as ButtonSize } from 'baseui/button'
import User from '@/components/User'
import { Modal, ModalHeader, ModalBody } from 'baseui/modal'
import { resourceIconMapping } from '@/consts'
import { useFetchOrganizationMembers } from '@/hooks/useFetchOrganizationMembers'
import qs from 'qs'
import { IDeploymentSchema } from '@/schemas/deployment'
import { ImlSchema } from '@/schemas/ml'
import { useQ } from '@/hooks/useQ'
import { LabelMedium, LabelXSmall, MonoParagraphXSmall } from 'baseui/typography'
import { useStyletron } from 'baseui'
import { createUseStyles } from 'react-jss'
import { IThemedStyleProps } from '@/interfaces/IThemedStyle'
import { useCurrentThemeType } from '@/hooks/useCurrentThemeType'
import { useSubscription } from '@/hooks/useSubscription'
import { IListSchema } from '@/schemas/list'
import SyntaxHighlighter from 'react-syntax-highlighter'
import { dark, docco } from 'react-syntax-highlighter/dist/esm/styles/hljs'
import { useOrganization } from '@/hooks/useOrganization'
import FilterBar from './FilterBar'
import FilterInput from './FilterInput'
import Time from './Time'
import Grid from './Grid'
import List from './List'
import DeploymentStatusTag from './DeploymentStatusTag'
import Link from './Link'

const useStyles = createUseStyles({
    item: (props: IThemedStyleProps) => ({
        'display': 'flex',
        'alignItems': 'center',
        'padding': '2px',
        'borderBottom': `1px solid ${props.theme.borders.border100.borderColor}`,
        'cursor': 'pointer',
        '&:hover': {
            backgroundColor: props.theme.colors.backgroundSecondary,
        },
    }),
    itemsContainer: () => ({
        '& $item:last-child': {
            borderBottom: 'none',
        },
    }),
})

export default function mlRepositoryListCard() {
    const [, theme] = useStyletron()
    const themeType = useCurrentThemeType()
    const styles = useStyles({ theme, themeType })
    const { q, updateQ } = useQ()
    const membersInfo = useFetchOrganizationMembers()
    const [page] = usePage()
    const { organization } = useOrganization()
    const queryKey = `fetchmlRepositories:${organization?.name}:${qs.stringify(page)}`
    const mlRepositoriesInfo = useQuery(queryKey, () => listmlRepositories(page))
    const [isCreatemlOpen, setIsCreatemlOpen] = useState(false)
    const [t] = useTranslation()
    const highlightTheme = themeType === 'dark' ? dark : docco

    const queryClient = useQueryClient()
    const mlUids = useMemo(
        () =>
            mlRepositoriesInfo.data?.items.reduce(
                (acc, cur) => [...acc, ...cur.latest_mls.map((x) => x.uid)],
                [] as string[]
            ) ?? [],
        [mlRepositoriesInfo.data?.items]
    )
    const subscribemlCb = useCallback(
        (ml: ImlSchema) => {
            queryClient.setQueryData(
                queryKey,
                (
                    oldData?: IListSchema<ImlRepositoryWithLatestDeploymentsSchema>
                ): IListSchema<ImlRepositoryWithLatestDeploymentsSchema> => {
                    if (!oldData) {
                        return {
                            start: 0,
                            count: 0,
                            total: 0,
                            items: [],
                        }
                    }
                    return {
                        ...oldData,
                        items: oldData.items.map((oldmlRepository) => {
                            return {
                                ...oldmlRepository,
                                latest_mls: oldmlRepository.latest_mls.map((oldml) => {
                                    if (oldml.uid === ml.uid) {
                                        return ml
                                    }
                                    return oldml
                                }),
                            }
                        }),
                    }
                }
            )
        },
        [queryClient, queryKey]
    )
    const deploymentUids = useMemo(
        () =>
            mlRepositoriesInfo.data?.items.reduce(
                (acc, cur) => [...acc, ...cur.latest_deployments.map((x) => x.uid)],
                [] as string[]
            ) ?? [],
        [mlRepositoriesInfo.data?.items]
    )
    const subscribeDeploymentCb = useCallback(
        (deployment: IDeploymentSchema) => {
            queryClient.setQueryData(
                queryKey,
                (
                    oldData?: IListSchema<ImlRepositoryWithLatestDeploymentsSchema>
                ): IListSchema<ImlRepositoryWithLatestDeploymentsSchema> => {
                    if (!oldData) {
                        return {
                            start: 0,
                            count: 0,
                            total: 0,
                            items: [],
                        }
                    }
                    return {
                        ...oldData,
                        items: oldData.items.map((oldmlRepository) => {
                            return {
                                ...oldmlRepository,
                                latest_deployments: oldmlRepository.latest_deployments.map((oldDeployment) => {
                                    if (oldDeployment.uid === deployment.uid) {
                                        return deployment
                                    }
                                    return oldDeployment
                                }),
                            }
                        }),
                    }
                }
            )
        },
        [queryClient, queryKey]
    )

    const { subscribe, unsubscribe } = useSubscription()

    useEffect(() => {
        subscribe({
            resourceType: 'ml',
            resourceUids: mlUids,
            cb: subscribemlCb,
        })
        return () => {
            unsubscribe({
                resourceType: 'ml',
                resourceUids: mlUids,
                cb: subscribemlCb,
            })
        }
    }, [subscribe, unsubscribe, mlUids, subscribemlCb])

    useEffect(() => {
        subscribe({
            resourceType: 'deployment',
            resourceUids: deploymentUids,
            cb: subscribeDeploymentCb,
        })
        return () => {
            unsubscribe({
                resourceType: 'deployment',
                resourceUids: deploymentUids,
                cb: subscribeDeploymentCb,
            })
        }
    }, [deploymentUids, subscribe, subscribeDeploymentCb, unsubscribe])

    const handleRenderItem = useCallback(
        (mlRepository: ImlRepositoryWithLatestDeploymentsSchema) => {
            return (
                <div
                    style={{
                        position: 'relative',
                        height: 'calc(100% - 40px)',
                    }}
                >
                    <div
                        style={{
                            position: 'relative',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '14px',
                            gap: 16,
                            paddingBottom: 30,
                        }}
                    >
                        <div
                            style={{
                                position: 'absolute',
                                left: 0,
                                top: 0,
                                display: 'flex',
                                alignItems: 'center',
                                gap: 4,
                            }}
                        >
                            <div
                                style={{
                                    display: 'inline-flex',
                                }}
                            >
                                {React.createElement(resourceIconMapping.ml, { size: 18 })}
                            </div>
                            <div>{mlRepository.n_mls}</div>
                        </div>
                        <LabelMedium>
                            <Link href={`/ml_repositories/${mlRepository.name}`}>{mlRepository.name}</Link>
                        </LabelMedium>
                    </div>
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 20,
                        }}
                    >
                        <div
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: 3,
                            }}
                        >
                            <div
                                style={{
                                    paddingBottom: 10,
                                    borderBottom: `1px solid ${theme.borders.border200.borderColor}`,
                                }}
                            >
                                <LabelXSmall>{t('latest deployments')}</LabelXSmall>
                            </div>
                            <List
                                emptyText={t('no deployment found')}
                                items={mlRepository.latest_deployments}
                                itemsContainerClassName={styles.itemsContainer}
                                onRenderItem={(item: IDeploymentSchema) => {
                                    return (
                                        <div
                                            key={item.uid}
                                            className={styles.item}
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: 10,
                                            }}
                                            onClick={(e: React.MouseEvent) => {
                                                e.currentTarget.querySelector('a')?.click()
                                            }}
                                            role='button'
                                            tabIndex={0}
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
                                    )
                                }}
                            />
                        </div>
                        <div
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: 3,
                            }}
                        >
                            <div
                                style={{
                                    paddingBottom: 10,
                                    borderBottom: `1px solid ${theme.borders.border200.borderColor}`,
                                }}
                            >
                                <LabelXSmall>{t('latest versions')}</LabelXSmall>
                            </div>
                            <List
                                items={mlRepository.latest_mls}
                                itemsContainerClassName={styles.itemsContainer}
                                onRenderItem={(item: ImlSchema) => {
                                    return (
                                        <div
                                            className={styles.item}
                                            key={item.uid}
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: 10,
                                            }}
                                            onClick={(e: React.MouseEvent) => {
                                                e.currentTarget.querySelector('a')?.click()
                                            }}
                                            role='button'
                                            tabIndex={0}
                                        >
                                            <div
                                                style={{
                                                    display: 'flex',
                                                    flexGrow: 1,
                                                    justifyContent: 'space-between',
                                                }}
                                            >
                                                <Link
                                                    href={`/ml_repositories/${mlRepository.name}/mls/${item.version}`}
                                                >
                                                    <MonoParagraphXSmall
                                                        overrides={{
                                                            Block: {
                                                                style: {
                                                                    margin: 0,
                                                                },
                                                            },
                                                        }}
                                                    >
                                                        {item.version}
                                                    </MonoParagraphXSmall>
                                                </Link>
                                                <Time time={item.created_at} />
                                            </div>
                                        </div>
                                    )
                                }}
                            />
                        </div>
                    </div>
                </div>
            )
        },
        [styles.item, styles.itemsContainer, t, theme.borders.border200.borderColor]
    )

    return (
        <Card
            title={t('ml repositories')}
            titleIcon={resourceIconMapping.ml}
            middle={
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        flexGrow: 1,
                    }}
                >
                    <div
                        style={{
                            width: 100,
                            flexGrow: 1,
                        }}
                    />
                    <div
                        style={{
                            flexGrow: 2,
                            flexShrink: 0,
                            maxWidth: 1200,
                        }}
                    >
                        <FilterInput
                            filterConditions={[
                                {
                                    qStr: 'creator:@me',
                                    label: t('the mls I created'),
                                },
                                {
                                    qStr: 'last_updater:@me',
                                    label: t('my last updated mls'),
                                },
                            ]}
                        />
                    </div>
                </div>
            }
            extra={
                <Button size={ButtonSize.compact} onClick={() => setIsCreatemlOpen(true)}>
                    {t('create')}
                </Button>
            }
        >
            <FilterBar
                filters={[
                    {
                        showInput: true,
                        multiple: true,
                        options:
                            membersInfo.data?.map(({ user }) => ({
                                id: user.name,
                                label: <User user={user} />,
                            })) ?? [],
                        value: ((q.creator as string[] | undefined) ?? []).map((v) => ({
                            id: v,
                        })),
                        onChange: ({ value }) => {
                            updateQ({
                                creator: value.map((v) => String(v.id ?? '')),
                            })
                        },
                        label: t('creator'),
                    },
                    {
                        showInput: true,
                        multiple: true,
                        options:
                            membersInfo.data?.map(({ user }) => ({
                                id: user.name,
                                label: <User user={user} />,
                            })) ?? [],
                        value: ((q.last_updater as string[] | undefined) ?? []).map((v) => ({
                            id: v,
                        })),
                        onChange: ({ value }) => {
                            updateQ({
                                last_updater: value.map((v) => String(v.id ?? '')),
                            })
                        },
                        label: t('last updater'),
                    },
                    {
                        options: [
                            {
                                id: 'updated_at-desc',
                                label: t('newest update'),
                            },
                            {
                                id: 'updated_at-asc',
                                label: t('oldest update'),
                            },
                        ],
                        value: ((q.sort as string[] | undefined) ?? []).map((v) => ({
                            id: v,
                        })),
                        onChange: ({ value }) => {
                            updateQ({
                                sort: value.map((v) => String(v.id ?? '')),
                            })
                        },
                        label: t('sort'),
                    },
                ]}
            />
            <Grid
                isLoading={mlRepositoriesInfo.isLoading}
                items={mlRepositoriesInfo.data?.items ?? []}
                onRenderItem={handleRenderItem}
                paginationProps={{
                    start: mlRepositoriesInfo.data?.start,
                    count: mlRepositoriesInfo.data?.count,
                    total: mlRepositoriesInfo.data?.total,
                    afterPageChange: () => {
                        mlRepositoriesInfo.refetch()
                    },
                }}
            />
            <Modal isOpen={isCreatemlOpen} onClose={() => setIsCreatemlOpen(false)} closeable animate autoFocus>
                <ModalHeader>{t('create sth', [t('ml')])}</ModalHeader>
                <ModalBody>
                    <div>
                        <p>
                            1. {t('Follow to [mlML quickstart guide] to create your first ml. prefix')}
                            <Link href='https://docs.mlml.org/en/latest/tutorial.html' target='_blank'>
                                {t('mlML quickstart guide')}
                            </Link>
                            {t('Follow to [mlML quickstart guide] to create your first ml. suffix')}
                        </p>
                        <p>
                            2. {t('Create an [API-token] and login your mlML CLI. prefix')}
                            <Link href='/api_tokens' target='_blank'>
                                {t('api token')}
                            </Link>
                            {t('Create an [API-token] and login your mlML CLI. suffix')}
                        </p>
                        <p>
                            3. {t('Push new ml to yeti with the `mlml push` CLI command. prefix')}
                            <SyntaxHighlighter
                                language='bash'
                                style={highlightTheme}
                                customStyle={{
                                    margin: 0,
                                    display: 'inline',
                                    padding: 2,
                                }}
                            >
                                mlml push
                            </SyntaxHighlighter>
                            {t('Push new ml to yeti with the `mlml push` CLI command. suffix')}
                        </p>
                    </div>
                </ModalBody>
            </Modal>
        </Card>
    )
}

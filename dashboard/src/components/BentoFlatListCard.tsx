import { useCallback, useEffect, useMemo } from 'react'
import { useQuery, useQueryClient } from 'react-query'
import Card from '@/components/Card'
import { listAllmls } from '@/services/ml'
import { usePage } from '@/hooks/usePage'
import { ImlSchema, ImlWithRepositorySchema } from '@/schemas/ml'
import useTranslation from '@/hooks/useTranslation'
import User from '@/components/User'
import { resourceIconMapping } from '@/consts'
import { useSubscription } from '@/hooks/useSubscription'
import { IListSchema } from '@/schemas/list'
import qs from 'qs'
import { useFetchOrganizationMembers } from '@/hooks/useFetchOrganizationMembers'
import { useQ } from '@/hooks/useQ'
import prettyBytes from 'pretty-bytes'
import { useOrganization } from '@/hooks/useOrganization'
import FilterInput from './FilterInput'
import FilterBar from './FilterBar'
import { ResourceLabels } from './ResourceLabels'
import Time from './Time'
import List from './List'
import Link from './Link'
import ListItem from './ListItem'

export default function mlFlatListCard() {
    const { q, updateQ } = useQ()
    const [page] = usePage()
    const { organization } = useOrganization()
    const queryKey = `fetchAllmls:${organization?.name}:${qs.stringify(page)}`
    const mlsInfo = useQuery(queryKey, () => listAllmls(page))
    const membersInfo = useFetchOrganizationMembers()
    const [t] = useTranslation()

    const uids = useMemo(
        () => mlsInfo.data?.items.map((mlVersion) => mlVersion.uid) ?? [],
        [mlsInfo.data?.items]
    )
    const queryClient = useQueryClient()
    const subscribeCb = useCallback(
        (ml: ImlSchema) => {
            queryClient.setQueryData(queryKey, (oldData?: IListSchema<ImlSchema>): IListSchema<ImlSchema> => {
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
                    items: oldData.items.map((oldml) => {
                        if (oldml.uid === ml.uid) {
                            return {
                                ...oldml,
                                ...ml,
                            }
                        }
                        return oldml
                    }),
                }
            })
        },
        [queryClient, queryKey]
    )
    const { subscribe, unsubscribe } = useSubscription()

    useEffect(() => {
        subscribe({
            resourceType: 'ml',
            resourceUids: uids,
            cb: subscribeCb,
        })
        return () => {
            unsubscribe({
                resourceType: 'ml',
                resourceUids: uids,
                cb: subscribeCb,
            })
        }
    }, [subscribe, subscribeCb, uids, unsubscribe])

    const handleRenderItem = useCallback(
        (ml: ImlWithRepositorySchema) => {
            return (
                <ListItem
                    key={ml.uid}
                    endEnhancer={() => (
                        <div
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: 8,
                            }}
                        >
                            <div
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 8,
                                }}
                            >
                                <div>{prettyBytes(ml.manifest.size_bytes)}</div>
                            </div>
                            <div
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 8,
                                }}
                            >
                                {ml.creator && <User size='16px' user={ml.creator} />}
                                {t('Created At')}
                                <Time time={ml.created_at} />
                            </div>
                        </div>
                    )}
                >
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 10,
                        }}
                    >
                        <Link href={`/ml_repositories/${ml.repository.name}/mls/${ml.version}`}>
                            {ml.repository.name}:{ml.version}
                        </Link>
                        <ResourceLabels resource={ml} />
                    </div>
                </ListItem>
            )
        },
        [t]
    )

    return (
        <Card
            title={t('mls')}
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
                            ]}
                        />
                    </div>
                </div>
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
                        options: [
                            {
                                id: 'build_at-desc',
                                label: t('newest build'),
                            },
                            {
                                id: 'build_at-asc',
                                label: t('oldest build'),
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
            <List
                isLoading={mlsInfo.isLoading}
                items={mlsInfo.data?.items ?? []}
                onRenderItem={handleRenderItem}
                paginationProps={{
                    start: mlsInfo.data?.start,
                    count: mlsInfo.data?.count,
                    total: mlsInfo.data?.total,
                    afterPageChange: () => {
                        mlsInfo.refetch()
                    },
                }}
            />
        </Card>
    )
}

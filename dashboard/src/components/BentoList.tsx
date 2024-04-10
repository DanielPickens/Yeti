import { useSubscription } from '@/hooks/useSubscription'
import useTranslation from '@/hooks/useTranslation'
import { IPaginationProps } from '@/interfaces/IPaginationProps'
import { ImlSchema, ImlWithRepositorySchema } from '@/schemas/ml'
import { IListSchema } from '@/schemas/list'
import { MonoParagraphXSmall } from 'baseui/typography'
import prettyBytes from 'pretty-bytes'
import { useCallback, useEffect, useMemo } from 'react'
import { useQueryClient } from 'react-query'
import { useHistory } from 'react-router-dom'
import Link from './Link'
import List from './List'
import ListItem from './ListItem'
import { ResourceLabels } from './ResourceLabels'
import Time from './Time'
import User from './User'

export interface ImlListProps {
    queryKey: string
    isLoading: boolean
    mls: ImlWithRepositorySchema[]
    paginationProps?: IPaginationProps
}

export default function mlList({ queryKey, isLoading, mls, paginationProps }: ImlListProps) {
    const [t] = useTranslation()

    const uids = useMemo(() => mls.map((ml) => ml.uid) ?? [], [mls])
    const queryClient = useQueryClient()
    const subscribeCb = useCallback(
        (mlVersion: ImlSchema) => {
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
                    items: oldData.items.map((oldmlVersion) => {
                        if (oldmlVersion.uid === mlVersion.uid) {
                            return {
                                ...oldmlVersion,
                                ...mlVersion,
                            }
                        }
                        return oldmlVersion
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

    const history = useHistory()

    const handleRenderItem = useCallback(
        (ml: ImlWithRepositorySchema) => {
            return (
                <ListItem
                    onClick={() => {
                        history.push(`/ml_repositories/${ml.repository.name}/mls/${ml.version}`)
                    }}
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
                                    justifyContent: 'flex-end',
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
                            <MonoParagraphXSmall
                                overrides={{
                                    Block: {
                                        style: {
                                            margin: 0,
                                        },
                                    },
                                }}
                            >
                                {ml.repository.name}:{ml.version}
                            </MonoParagraphXSmall>
                        </Link>
                        <ResourceLabels resource={ml} />
                    </div>
                </ListItem>
            )
        },
        [history, t]
    )

    return (
        <List isLoading={isLoading} items={mls} onRenderItem={handleRenderItem} paginationProps={paginationProps} />
    )
}

import { useState } from 'react'
import { useQuery } from 'react-query'
import Card from '@/components/Card'
import { listmls } from '@/services/ml'
import { usePage } from '@/hooks/usePage'
import useTranslation from '@/hooks/useTranslation'
import { useCurrentThemeType } from '@/hooks/useCurrentThemeType'
import { Button, SIZE as ButtonSize } from 'baseui/button'
import User from '@/components/User'
import { Modal, ModalHeader, ModalBody } from 'baseui/modal'
import SyntaxHighlighter from 'react-syntax-highlighter'
import { dark, docco } from 'react-syntax-highlighter/dist/esm/styles/hljs'
import { resourceIconMapping } from '@/consts'
import qs from 'qs'
import { useQ } from '@/hooks/useQ'
import { useFetchOrganizationMembers } from '@/hooks/useFetchOrganizationMembers'
import FilterInput from './FilterInput'
import FilterBar from './FilterBar'
import mlList from './mlList'
import Link from './Link'

export interface ImlListCardProps {
    mlRepositoryName: string
}

export default function mlListCard({ mlRepositoryName }: ImlListCardProps) {
    const [page] = usePage()
    const themeType = useCurrentThemeType()
    const { q, updateQ } = useQ()
    const membersInfo = useFetchOrganizationMembers()
    const queryKey = `fetchmls:${mlRepositoryName}:${qs.stringify(page)}`
    const mlsInfo = useQuery(queryKey, () => listmls(mlRepositoryName, page))
    const [isCreatemlVersionOpen, setIsCreatemlVersionOpen] = useState(false)
    const [t] = useTranslation()
    const highlightTheme = themeType === 'dark' ? dark : docco

    return (
        <Card
            title={t('n mls', [mlsInfo.data?.total || 0])}
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
            extra={
                <Button size={ButtonSize.compact} onClick={() => setIsCreatemlVersionOpen(true)}>
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
                        options: [
                            {
                                id: 'build_at-desc',
                                label: t('newest build'),
                            },
                            {
                                id: 'build_at-asc',
                                label: t('oldest build'),
                            },
                            {
                                id: 'size-desc',
                                label: t('largest'),
                            },
                            {
                                id: 'size-asc',
                                label: t('smallest'),
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
            <mlList
                queryKey={queryKey}
                isLoading={mlsInfo.isFetching}
                mls={mlsInfo.data?.items ?? []}
                paginationProps={{
                    start: mlsInfo.data?.start,
                    count: mlsInfo.data?.count,
                    total: mlsInfo.data?.total,
                    afterPageChange: () => {
                        mlsInfo.refetch()
                    },
                }}
            />
            <Modal
                isOpen={isCreatemlVersionOpen}
                onClose={() => setIsCreatemlVersionOpen(false)}
                closeable
                animate
                autoFocus
            >
                <ModalHeader>{t('create sth', [t('version')])}</ModalHeader>
                <ModalBody>
                    <div>
                        <p>
                            1. {t('Create an [API-token] and login your mlML CLI. prefix')}
                            <Link href='/api_tokens' target='_blank'>
                                {t('api token')}
                            </Link>
                            {t('Create an [API-token] and login your mlML CLI. suffix')}
                        </p>
                        <p>
                            2. {t('Push new ml to yeti with the `mlml push` CLI command. prefix')}
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

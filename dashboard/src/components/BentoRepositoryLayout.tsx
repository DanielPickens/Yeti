import { usemlRepository, usemlRepositoryLoading } from '@/hooks/usemlRepository'
import useTranslation from '@/hooks/useTranslation'
import React, { useEffect, useMemo } from 'react'
import { useQuery } from 'react-query'
import { useHistory, useParams } from 'react-router-dom'
import { INavItem } from '@/components/BaseSidebar'
import { fetchmlRepository, listmlRepositoryDeployments } from '@/services/ml_repository'
import { useOrganization } from '@/hooks/useOrganization'
import { resourceIconMapping } from '@/consts'
import { Button } from 'baseui/button'
import qs from 'qs'
import BaseSubLayout from './BaseSubLayout'

export interface ImlRepositoryLayoutProps {
    children: React.ReactNode
}

export default function mlRepositoryLayout({ children }: ImlRepositoryLayoutProps) {
    const { mlRepositoryName } = useParams<{ mlRepositoryName: string }>()
    const mlRepositoryInfo = useQuery(`fetchmlRepository:${mlRepositoryName}`, () =>
        fetchmlRepository(mlRepositoryName)
    )
    const { mlRepository, setmlRepository } = usemlRepository()
    const { organization, setOrganization } = useOrganization()
    const { setmlRepositoryLoading: setmlLoading } = usemlRepositoryLoading()
    useEffect(() => {
        setmlLoading(mlRepositoryInfo.isLoading)
        if (mlRepositoryInfo.isSuccess) {
            if (mlRepositoryInfo.data.uid !== mlRepository?.uid) {
                setmlRepository(mlRepositoryInfo.data)
            }
            if (mlRepositoryInfo.data.organization?.uid !== organization?.uid) {
                setOrganization(mlRepositoryInfo.data.organization)
            }
        } else if (mlRepositoryInfo.isLoading) {
            setmlRepository(undefined)
        }
    }, [
        mlRepository?.uid,
        mlRepositoryInfo.data,
        mlRepositoryInfo.isLoading,
        mlRepositoryInfo.isSuccess,
        organization?.uid,
        setmlRepository,
        setmlLoading,
        setOrganization,
    ])

    const [t] = useTranslation()

    const breadcrumbItems: INavItem[] = useMemo(
        () => [
            {
                title: t('ml repositories'),
                path: '/ml_repositories',
                icon: resourceIconMapping.ml,
            },
            {
                title: mlRepositoryName,
                path: `/ml_repositories/${mlRepositoryName}`,
            },
        ],
        [mlRepositoryName, t]
    )

    const deploymentsInfo = useQuery(`mlRepository:${mlRepositoryName}:deployments`, () =>
        listmlRepositoryDeployments(mlRepositoryName, { count: 0, start: 0 })
    )

    const history = useHistory()

    return (
        <BaseSubLayout
            extra={
                <Button
                    isLoading={deploymentsInfo.isLoading}
                    kind='tertiary'
                    size='mini'
                    onClick={() =>
                        history.push(
                            `/deployments?${qs.stringify({
                                q: `ml_repository:${mlRepositoryName}`,
                            })}`
                        )
                    }
                >
                    {t('n deployments', [deploymentsInfo.data?.total ?? '-'])}
                </Button>
            }
            breadcrumbItems={breadcrumbItems}
        >
            {children}
        </BaseSubLayout>
    )
}

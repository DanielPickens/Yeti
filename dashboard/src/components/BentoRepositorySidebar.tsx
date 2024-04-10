import { usemlRepository, usemlRepositoryLoading } from '@/hooks/usemlRepository'
import useTranslation from '@/hooks/useTranslation'
import { RiSurveyLine } from 'react-icons/ri'
import React, { useEffect, useMemo } from 'react'
import { useQuery } from 'react-query'
import { useParams } from 'react-router-dom'
import BaseSidebar, { IComposedSidebarProps, INavItem } from '@/components/BaseSidebar'
import { fetchmlRepository } from '@/services/ml_repository'
import { useOrganization } from '@/hooks/useOrganization'
import { resourceIconMapping } from '@/consts'

export default function mlRepositorySidebar({ style }: IComposedSidebarProps) {
    const { mlRepositoryName } = useParams<{ mlRepositoryName: string }>()
    const mlRepositoryInfo = useQuery(`fetchmlRepository:${mlRepositoryName}`, () =>
        fetchmlRepository(mlRepositoryName)
    )
    const { mlRepository, setmlRepository } = usemlRepository()
    const { organization, setOrganization } = useOrganization()
    const { setmlRepositoryLoading } = usemlRepositoryLoading()
    useEffect(() => {
        setmlRepositoryLoading(mlRepositoryInfo.isLoading)
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
        setmlRepositoryLoading,
        setOrganization,
    ])

    const [t] = useTranslation()

    const navItems: INavItem[] = useMemo(
        () => [
            {
                title: t('overview'),
                path: `/ml_repositories/${mlRepositoryName}`,
                icon: RiSurveyLine,
            },
            {
                title: t('mls'),
                path: `/ml_repositories/${mlRepositoryName}/mls`,
                icon: resourceIconMapping.ml,
            },
        ],
        [mlRepositoryName, t]
    )
    return (
        <BaseSidebar title={mlRepositoryName} icon={resourceIconMapping.ml} navItems={navItems} style={style} />
    )
}

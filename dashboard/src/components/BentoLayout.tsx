import { useFetchml } from '@/hooks/useFetchml'
import { useml, usemlLoading } from '@/hooks/useml'
import useTranslation from '@/hooks/useTranslation'
import React, { useEffect, useMemo } from 'react'
import { useParams } from 'react-router-dom'
import { INavItem } from '@/components/BaseSidebar'
import { resourceIconMapping } from '@/consts'
import BaseSubLayout from './BaseSubLayout'

export interface ImlLayoutProps {
    children: React.ReactNode
}

export default function mlLayout({ children }: ImlLayoutProps) {
    const { mlRepositoryName, mlVersion } = useParams<{ mlRepositoryName: string; mlVersion: string }>()
    const mlInfo = useFetchml(mlRepositoryName, mlVersion)
    const { setml } = useml()
    const { setmlLoading } = usemlLoading()
    useEffect(() => {
        setml(mlInfo.data)
        setmlLoading(mlInfo.isLoading)
    }, [mlInfo, setml, setmlLoading])

    const [t] = useTranslation()

    const breadcrumbItems: INavItem[] = useMemo(
        () => [
            {
                title: t('mls'),
                path: '/ml_repositories',
                icon: resourceIconMapping.ml,
            },
            {
                title: `${mlRepositoryName}:${mlVersion}`,
                path: `/ml_repositories/${mlRepositoryName}/mls/${mlVersion}`,
            },
        ],
        [mlRepositoryName, mlVersion, t]
    )

    return <BaseSubLayout breadcrumbItems={breadcrumbItems}>{children}</BaseSubLayout>
}

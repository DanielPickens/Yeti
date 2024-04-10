import { ImlFullSchema } from '@/schemas/ml'
import { fetchml } from '@/services/ml'
import { useQuery } from 'react-query'
import { useOrganization } from './useOrganization'

export function useFetchml(mlRepositoryName: string, version: string) {
    const { organization } = useOrganization()
    const mlInfo = useQuery(`fetchml:${organization?.name}:${mlRepositoryName}:${version}`, () =>
        fetchml(mlRepositoryName, version)
    )
    return mlInfo
}

export function useFetchmlOptional(mlRepositoryName?: string, version?: string) {
    const { organization } = useOrganization()
    const mlInfo = useQuery(
        `fetchmlOptional:${organization?.name}:${mlRepositoryName}:${version}`,
        (): Promise<ImlFullSchema | undefined> =>
            mlRepositoryName && version ? fetchml(mlRepositoryName, version) : Promise.resolve(undefined)
    )
    return mlInfo
}

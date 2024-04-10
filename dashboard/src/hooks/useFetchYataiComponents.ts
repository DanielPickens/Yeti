import { listyetiComponents, listOrganizationyetiComponents } from '@/services/yeti_component'
import { useQuery } from 'react-query'
import { useOrganization } from './useOrganization'

export function useFetchyetiComponents(clusterName: string) {
    const { organization } = useOrganization()
    const queryKey = `fetchyetiComponents:${organization?.name}:${clusterName}`
    const yetiComponentsInfo = useQuery(queryKey, () => listyetiComponents(clusterName))
    return { yetiComponentsInfo }
}

export function useFetchOrganizationyetiComponents() {
    const { organization } = useOrganization()
    const queryKey = `fetchOrganizationyetiComponents:${organization?.name}`
    const yetiComponentsInfo = useQuery(queryKey, listOrganizationyetiComponents)
    return { yetiComponentsInfo }
}

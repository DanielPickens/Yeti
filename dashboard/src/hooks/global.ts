import { IDeploymentFullSchema } from '@/schemas/deployment'
import { ImlRepositorySchema } from '@/schemas/ml_repository'
import { IClusterFullSchema } from '@/schemas/cluster'
import { createGlobalState } from 'react-hooks-global-state'
import { IUserSchema } from '@/schemas/user'
import { IOrganizationFullSchema } from '@/schemas/organization'
import { IModelRepositorySchema } from '@/schemas/model_repository'
import { IModelFullSchema } from '@/schemas/model'
import { ImlFullSchema } from '@/schemas/ml'

export type BaseThemeType = 'light' | 'dark'
export type ThemeType = BaseThemeType | 'followTheSystem'

const initialState = {
    themeType: 'light' as ThemeType,
    currentUser: undefined as IUserSchema | undefined,
    user: undefined as IUserSchema | undefined,
    userLoading: false,
    organization: undefined as IOrganizationFullSchema | undefined,
    organizationLoading: false,
    cluster: undefined as IClusterFullSchema | undefined,
    clusterLoading: false,
    mlRepository: undefined as ImlRepositorySchema | undefined,
    mlRepositoryLoading: false,
    deployment: undefined as IDeploymentFullSchema | undefined,
    deploymentLoading: false,
    modelRepository: undefined as IModelRepositorySchema | undefined,
    modelRepositoryLoading: false,
    model: undefined as IModelFullSchema | undefined,
    modelLoading: false,
    ml: undefined as ImlFullSchema | undefined,
    mlLoading: false,
}

const { useGlobalState } = createGlobalState(initialState)
export default useGlobalState

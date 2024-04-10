import { ResourceType } from '@/schemas/resource'
import type { IconType } from 'react-icons/lib'
import { GrOrganization, GrServerCluster, GrDeploy, GrUser } from 'react-icons/gr'
import { AiOutlineCodeSandbox } from 'react-icons/ai'
import { HiOutlineUserGroup, HiOutlineKey } from 'react-icons/hi'
import { BiRevision, BiExtension } from 'react-icons/bi'
import { GoPackage } from 'react-icons/go'
import { VscFileBinary } from 'react-icons/vsc'
import { GiAbstract006, GiAbstract045 } from 'react-icons/gi'
import { SiDocker } from 'react-icons/si'
import { yetiComponentType } from '@/schemas/yeti_component'

export const headerHeight = 55
export const sidebarExpandedWidth = 220
export const sidebarFoldedWidth = 68
export const textVariant = 'smallPlus'
export const dateFormat = 'YYYY-MM-DD'
export const dateWithZeroTimeFormat = 'YYYY-MM-DD 00:00:00'
export const dateTimeFormat = 'YYYY-MM-DD HH:mm:ss'
export const yetiOrgHeader = 'X-yeti-Organization'

export const mlmlConfigsEnvKey = 'mlML_CONFIG_OPTIONS'

export const yetiComponentIconMapping: Record<yetiComponentType, IconType> = {
    'deployment': GrDeploy,
    'image-builder': SiDocker,
}

export const resourceIconMapping: Record<ResourceType, IconType> = {
    user: GrUser,
    user_group: HiOutlineUserGroup,
    organization: GrOrganization,
    cluster: GrServerCluster,
    ml_repository: GoPackage,
    ml: AiOutlineCodeSandbox,
    deployment: GrDeploy,
    deployment_revision: BiRevision,
    yeti_component: BiExtension,
    model_repository: VscFileBinary,
    model: VscFileBinary,
    api_token: HiOutlineKey,
    ml_runner: GiAbstract045,
    ml_api_server: GiAbstract006,
}

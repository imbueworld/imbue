import InformationStorageMechanism from './InformationStorageMechanism'

const Cache = {}
export default function cache(query) {
  return InformationStorageMechanism(Cache, query)
}
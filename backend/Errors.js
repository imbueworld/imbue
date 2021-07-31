const BusyError = new Error()
BusyError.message = 'Action is in process.'
BusyError.code = 'busy'

const ClassAlreadyBoughtError = new Error('You already own this class.')
ClassAlreadyBoughtError.code = 'class-already-bought'

const ClassAlreadyScheduledError = new Error('Class has already been added to your schedule.')
ClassAlreadyScheduledError.code = 'class-already-scheduled'

const MembershipAlreadyBoughtError = new Error('You already own this membership.')
MembershipAlreadyBoughtError.code = 'membership-already-bought'

export {
  BusyError,
  ClassAlreadyBoughtError,
  ClassAlreadyScheduledError,
  MembershipAlreadyBoughtError,
}
const morningSpace = document.querySelector('.morningSpace')
const middaySpace = document.querySelector('.middaySpace')
const eveningSpace = document.querySelector('.eveningSpace')

function createSpaceMorning () {
  const morningSpaceActivities = document.createElement('div')
  morningSpaceActivities.className = 'activitiesSpaceMorning'
  morningSpace.appendChild(morningSpaceActivities)
}

function createSpaceMidday () {
  const middaySpaceActivities = document.createElement('div')
  middaySpaceActivities.className = 'activitiesSpaceMidday'
  middaySpace.appendChild(middaySpaceActivities)
}

function createSpaceEvening () {
  const eveningSpaceActivities = document.createElement('div')
  eveningSpaceActivities.className = 'activitiesSpaceEvening'
  eveningSpace.appendChild(eveningSpaceActivities)
}

for (i = 0; i < 7; i++) {
  createSpaceMorning()
  createSpaceMidday()
  createSpaceEvening()
}

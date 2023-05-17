const SERVER = 'http://localhost:8000'
function downloadFile(lessonId, name) {
  saveAs(`${SERVER}/resources/${lessonId}/${name}`, name)
  // console.log('ascoiahc')
}

async function loadLesson() {
  const hash = parent.window.location.hash
  if (hash === '#') return
  const lessonId = hash.split('#')[2]

  const get = await fetch('../data/data.json')
  const data = await get.json()

  const { outcomes: courseOutcomes, parts } = data

  let lessonData = null
  for (const part of parts) {
    for (const lesson of part.lessons) {
      if (lesson._id === lessonId) {
        lessonData = lesson
        break
      }
    }
  }
  if (lessonData) {
    const { name, outcomes, content, preparation, resources, lessonParts } = lessonData
    document.getElementById('lesson-name').innerHTML = name
    setResources(resources, lessonId)
    setActivity(lessonParts, lessonId)
    setOutcomes(courseOutcomes, outcomes)
    setContent(content)
    setPreparation(preparation)
    drawCanvas(lessonParts)
  }
}

function setOutcomes(courseOutcomes, outcomes) {
  if (!outcomes || !courseOutcomes) return
  const parsedCourseOutcomes = JSON.parse(courseOutcomes).subs.reduce(
    (res, cur) => ({ ...res, [cur.sId]: cur }),
    {}
  )

  const parsedLessonOutcomes = JSON.parse(outcomes)
  const knowledges = Object.entries(parsedLessonOutcomes.knowledges)
    .filter(([, value]) => value === true)
    .map(
      ([key]) =>
        `<li><strong>${parsedCourseOutcomes[key].id}. </strong>${parsedCourseOutcomes[key].value}</li>`
    )
    .join('\n')
  const skills = Object.entries(parsedLessonOutcomes.skills)
    .filter(([, value]) => value === true)
    .map(
      ([key]) =>
        `<li><strong>${parsedCourseOutcomes[key].id}. </strong>${parsedCourseOutcomes[key].value}</li>`
    )
    .join('\n')
  const attitudes = Object.entries(parsedLessonOutcomes.attitudes)
    .filter(([, value]) => value === true)
    .map(
      ([key]) =>
        `<li><strong>${parsedCourseOutcomes[key].id}. </strong>${parsedCourseOutcomes[key].value}</li>`
    )
    .join('\n')
  document.getElementById('knowledge').innerHTML = knowledges
  document.getElementById('skill').innerHTML = skills
  document.getElementById('attitude').innerHTML = attitudes
}

function setContent(content) {
  if (!content) return
  const parsedContent = JSON.parse(content).contents
  const contentHTML = Object.entries(parsedContent)
    .map(([, value]) => `<li class='content-item' >${value}</li>`)
    .join('\n')
  document.getElementById('content-detail').innerHTML = contentHTML
}

function setPreparation(preparation) {
  document.getElementById('preparation').innerText = preparation || ''
}

let images = []
let others = []

function setResources(resources, lessonId) {
  for (const r of resources) {
    if (r.type.includes('image')) {
      images = [...images, r.name]
    } else {
      others = [...others, r.name]
    }
  }
  const imgHTML = images
    .map(
      (img) =>
        `<div class="cols img-bound " >
          <img class='img' src="${SERVER}/resources/${lessonId}/${img}" width='100%' />
          <button type='button' class='img-btn' id="${img}" >
            Download
          </button>
        </div>`
    )
    .join('\n')
  document.getElementById('images').innerHTML = imgHTML
  for (const img of images) {
    document.getElementById(img).addEventListener('click', () => {
      downloadFile(lessonId, img)
    })
  }
  const otherHTML = others
    .map(
      (file, index) =>
        `<div class='file-bound' >
      <div class='file-name' >${index + 1}. ${file}</div>
      <button type='button' id="${file}" >
        <img src="download.png" width="20"/>
      </button>
    </div>`
    )
    .join('\n')
  document.getElementById('others').innerHTML = otherHTML
  for (const file of others) {
    document.getElementById(file).addEventListener('click', () => {
      downloadFile(lessonId, file)
    })
  }
}

const ACTION = {
  READ_WATCH_LISTEN: 'Read-Watch-Listen',
  COLLABORATE: 'Collaborate',
  DISCUSS: 'Discuss',
  INVESTIGATE: 'Investigate',
  PRACTICE: 'Practice',
  PRODUCE: 'Produce'
}

const parser = new DOMParser()

function setActivity(lessonParts, lessonId) {
  let inner = ``
  for (const part of lessonParts) {
    let group = `<div class='group-act'>
    <div class='group-name'>${part.name}</div>`
    for (const action of part.learningActions) {
      group += `<div class='action'>
                  <div class='act-name'>${action.name}</div>
                  <div class='act-type-container'>
                    <div class='type '>${ACTION[action.action]}</div>
                    <div class='time has-icon'>
                      <img src='wall-clock.png' alt='time' width='16' height='16'>
                      <label>${action.time}m</label>
                    </div>
                    <div class='online has-icon'>
                      <img src='earth-grid.png' alt='time' width='16' height='16'>
                      <label>${action.online ? 'ON' : 'OFF'}</label>
                    </div>
                    <div class='amount-std has-icon'>
                      <img src='user.png' alt='time' width='16' height='16'>
                      <label>${action.students}</label>
                    </div>
                    <button type='button' class='act-resources has-icon' data-bs-toggle="modal"
                      data-bs-target="#resource-action-${action._id}" >
                      <img src='attachment.png' alt='time' width='16' height='16'>
                      <label>${action.resources ? Object.keys(action.resources).length : 0 }</label>
                    </button>
                  </div>
                  <div class='act-des'>${action.description}</div>
                </div>`
      const actRs = action.resources
      let resourceModal = `<div class="modal fade" id="resource-action-${action._id}" aria-labelledby="exampleModalToggleLabel" tabindex="-1"
                              aria-hidden="true" style="display: none;">
                              <div class="modal-dialog modal-dialog-centered">
                                <div class="modal-content">
                                  <div class="modal-header">
                                    <div class="modal-title" id="exampleModalToggleLabel">Resource of ${action.name}</div>
                                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                  </div>
                                  <div class="modal-body modal-flex" id="resource-body-${action._id}">
                                    <div>
                                      <div class="head">Images</div>
                                  `

      for (const rId in actRs) {
        if (actRs[rId]) {
          if (images.includes(rId)) {
            resourceModal += `<img src="${SERVER}/resources/${lessonId}/${rId}" alt="img" width="100" />`
          }
        }
      }
      resourceModal += `</div>
                        <div>
                          <div class="head">Other types</div>`
      for (const rId in actRs) {
        if (actRs[rId]) {
          if (others.includes(rId)) {
            resourceModal += `<div>${rId}</div>`
          }
        }
      }
      resourceModal += `</div>`
      resourceModal += `</div>
                      </div>
                    </div>
                  </div>`
      document.body.innerHTML += resourceModal
    }
    group += `</div>`
    inner += group
  }
  document.getElementById('act-container').innerHTML = inner
}

const backgroundColor = [
  'rgba(255, 99, 132, 1)',
  'rgba(54, 162, 235, 1)',
  'rgba(255, 166, 86, 1)',
  'rgba(75, 192, 192, 1)',
  'rgba(153, 102, 255, 1)',
  'rgba(255, 159, 64, 1)'
]

function drawCanvas(lessonParts) {
  let rs = {}
  for (const part of lessonParts) {
    for (const action of part.learningActions) {
      rs = { ...rs, [action.action]: (rs[action.action] || 0) + 1 }
    }
  }
  const totalType = Object.keys(rs).length
  const ctx = document.getElementById('my-chart').getContext('2d')
  const myChart = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: Object.entries(rs).map(([type]) => ACTION[type]),
      datasets: [
        {
          label: '# of Votes',
          data: Object.entries(rs).map(([, value]) => value),
          backgroundColor: backgroundColor.slice(0, totalType),
          borderWidth: 1
        }
      ]
    }
  })
}

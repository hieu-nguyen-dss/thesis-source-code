const SERVER = 'http://localhost:8000'

function goToOutcome () {
  const frame = parent.document.getElementById('contentFrame')
  parent.window.location.hash += `#outcomes`
  ScormProcessSetValue('cmi.location', `#outcomes`)
  frame.src = `../Outcome/index.html`
}

function goToRubrics () {
  const frame = parent.document.getElementById('contentFrame')
  parent.window.location.hash += `#rubrics`
  ScormProcessSetValue('cmi.location', `#rubrics`)
  frame.src = `../Rubric/index.html`
}

function goToLesson(name) {
  const frame = parent.document.getElementById('contentFrame')
  parent.window.location.hash += `#${name}`
  ScormProcessSetValue('cmi.location', `#${name}`)
  frame.src = `../Lesson/Lesson.html`
}

async function loadData() {
  const get = await fetch('../data/data.json')
  const data = await get.json()
  const {
    name,
    category,
    description,
    id,
    stars,
    ownerId: { name: ownerName, avatar, _id }
  } = data
  setMainInfo({ name, category, description, id, stars, ownerName, avatar, _id })
  setTableOfContent(data.parts)
  parent.window.location.hash = id
}

function setMainInfo(data) {
  const {
    name,
    category,
    description,
    id,
    stars,
    ownerName,
    avatar,
    _id
  } = data
  document.getElementById('course-name').innerHTML = name
  document.getElementById('info-name').innerHTML = name
  document.getElementById('info-id').innerHTML = id
  document.getElementById('stars').innerHTML = stars || 0
  document.getElementById('description').innerHTML = description
  document.getElementById('category').innerHTML = category
  document.getElementById('info-owner-name').innerHTML = ownerName
  document.getElementById(
    'avatar'
  ).src = `${SERVER}/resources/avatars/${_id}/64x64${avatar}`
}

function setTableOfContent(parts) {
  let beginChapter = ``
  for (const part of parts) {
    beginChapter += `<div class='accordion-item hidden'>
                      <h2 class='accordion-header' id='panelsStayOpen-heading${part._id}'>
                        <button class='accordion-button' type='button' data-bs-toggle='collapse' data-bs-target='#chapter-${part._id}'
                          aria-expanded='true' aria-controls='panelsStayOpen-collapse${part._id}'
                          style='font-size: 14px; font-weight: bold'>
                            ${part.name}
                        </button>
                      </h2>
                      <div id='chapter-${part._id}' class='accordion-collapse collapse' aria-labelledby='panelsStayOpen-heading${part._id}'>
                        <div class='accordion-body chapter-lessons'>`
    for (const lesson of part.lessons) {
      beginChapter += `<button onclick='goToLesson("${lesson._id}")' type='button' class='lesson'>${lesson.name}</button>\n`
    }
    beginChapter += `</div></div></div>`
  }
  document.getElementById('chapter-list').innerHTML = beginChapter
}



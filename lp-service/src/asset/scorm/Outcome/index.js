async function loadOutcomes() {
  const get = await fetch('../data/data.json')
  const data = await get.json()
  const { outcomes } = data
  if (!outcomes) return
  const { mains, subs } = JSON.parse(outcomes)

  let rs = ``
  let i = 0
  for (const main of mains) {
    rs += `<div class="full-outcome" id="full-outcome-${main.mId}">
            <div class="main-outcome main-nth-${i % 3}" id="main-outcome-${main.mId}">
              <div class="main-id">${main.id}</div>
              <div class="main-value">${main.value}</div>
            </div>
            <div id="curve-${main.mId}">
            </div>
            <div class="sub-outcomes">`
    const allSub = subs.filter((sub) => sub.parent === main.mId)
    for (const sub of allSub) {
      rs += `<div class="sub-outcome-item sub-nth-${i % 3}" id="sub-${sub.sId}">
              <div class="sub-id">${sub.id}</div>
              <div class="sub-value">${sub.value}</div>
            </div>`
    }
    rs += ` </div>
          </div>`
    i++
  }

  document.getElementById('all-outcomes').innerHTML = rs

  for (const main of mains) {
    const allSub = subs.filter((sub) => sub.parent === main.mId)
    let paths = ` <svg width="100%" height="60" id="curve-${main.mId}" >
                    <defs>
                      <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stop-color="#70b2d9" />
                        <stop offset="100%" stop-color="#39e5b6" />
                      </linearGradient>
                    </defs>
                 `
    for (const sub of allSub) {
      const oL = document.getElementById(`sub-${sub.sId}`).offsetLeft + 20
      paths += `<path d="M 30 0 L 30 15 Q 30 30 45 30 L ${
        oL - 15
      } 30 Q ${oL} 30 ${oL} 45 L ${oL} 60" stroke="url(#gradient)" stroke-width="4" fill="none" />`
    }
    paths += `</svg>`
    document.getElementById(`curve-${main.mId}`).innerHTML = paths
  }
}

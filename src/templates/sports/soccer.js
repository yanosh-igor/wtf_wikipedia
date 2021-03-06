const parse = require('../_parsers/parse')
const flags = require('../../_data/flags')

let sports = {
  player: (tmpl, r) => {
    let res = parse(tmpl, ['number', 'country', 'name', 'dl'])
    r.templates.push(res)
    let str = `[[${res.name}]]`
    if (res.country) {
      let country = (res.country || '').toLowerCase()
      let flag = flags.find(a => country === a[1] || country === a[2]) || []
      if (flag && flag[0]) {
        str = flag[0] + '  ' + str
      }
    }
    if (res.number) {
      str = res.number + ' ' + str
    }
    return str
  },

  //https://en.wikipedia.org/wiki/Template:Goal
  goal: (tmpl, r) => {
    let res = parse(tmpl)
    let obj = {
      template: 'goal',
      data: []
    }
    let arr = res.list || []
    for (let i = 0; i < arr.length; i += 2) {
      obj.data.push({
        min: arr[i],
        note: arr[i + 1] || ''
      })
    }
    r.templates.push(obj)
    //generate a little text summary
    let summary = '⚽ '
    summary += obj.data
      .map(o => {
        let note = o.note
        if (note) {
          note = ` (${note})`
        }
        return o.min + "'" + note
      })
      .join(', ')
    return summary
  },
  //yellow card
  yel: (tmpl, r) => {
    let obj = parse(tmpl, ['min'])
    r.templates.push(obj)
    if (obj.min) {
      return `yellow: ${obj.min || ''}'` //no yellow-card emoji
    }
    return ''
  },
  subon: (tmpl, r) => {
    let obj = parse(tmpl, ['min'])
    r.templates.push(obj)
    if (obj.min) {
      return `sub on: ${obj.min || ''}'` //no yellow-card emoji
    }
    return ''
  },
  suboff: (tmpl, r) => {
    let obj = parse(tmpl, ['min'])
    r.templates.push(obj)
    if (obj.min) {
      return `sub off: ${obj.min || ''}'` //no yellow-card emoji
    }
    return ''
  },
  pengoal: (tmpl, r) => {
    r.templates.push({
      template: 'pengoal'
    })
    return '✅'
  },
  penmiss: (tmpl, r) => {
    r.templates.push({
      template: 'penmiss'
    })
    return '❌'
  },
  //'red' card - {{sent off|cards|min1|min2}}
  'sent off': (tmpl, r) => {
    let obj = parse(tmpl, ['cards'])
    let result = {
      template: 'sent off',
      cards: obj.cards,
      minutes: obj.list || []
    }
    r.templates.push(result)
    let mins = result.minutes.map(m => m + "'").join(', ')
    return 'sent off: ' + mins
  }
}
module.exports = sports

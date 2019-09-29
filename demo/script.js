import moment from 'moment-timezone'
import Origin from '../src/Origin'
import Horoscope from '../src/Horoscope'
import { decimalDegreesToDMS } from '../src/utilities/math'

class DemoApp {
  constructor() {
    this.form = document.querySelector('#form')
    this.dateInput = document.querySelector('#date')
    this.timeInput = document.querySelector('#time')
    this.latitudeInput = document.querySelector('#latitude')
    this.longitudeInput = document.querySelector('#longitude')
    this.houseSystemSelect = document.querySelector('#houseSystem')

    this.sunSignElement = document.querySelector('#sunsign')
    this.midheavenElement = document.querySelector('#midheaven')
    this.ascendantElement = document.querySelector('#ascendant')
    this.housesElement = document.querySelector('#houses')

    this.displayDateTime = this.displayDateTime.bind(this)
    this.loadHouseSystemSelect = this.loadHouseSystemSelect.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)

    this.displayDateTime()
    this.loadHouseSystemSelect()
    this.form.addEventListener('submit', this.handleSubmit)
  }

  displayDateTime() {
    const today = moment(new Date())
    this.dateInput.value = today.format('YYYY-MM-DD');
    this.timeInput.value = today.format('HH:mm:00')
  }

  loadHouseSystemSelect() {
    Horoscope.HouseSystems.forEach(system => {
      var opt = document.createElement('option');
      opt.value = system
      opt.appendChild(document.createTextNode(system))
      this.houseSystemSelect.appendChild(opt)
    })

    this.houseSystemSelect.value = "placidus"

  }

  handleSubmit(e) {
    e.preventDefault()
    const timestamp = moment(`${this.dateInput.value} ${this.timeInput.value}`)
    const origin = new Origin({
      year: timestamp.year(),
      month: timestamp.month(),
      date: timestamp.date(),
      hour: timestamp.hours(),
      minute: timestamp.minutes(),
      latitude: this.latitudeInput.value,
      longitude: this.longitudeInput.value
    })


    const horoscope = new Horoscope({
      origin: origin,
      houseSystem: this.houseSystemSelect.value,
      zodiac: 'tropical'
    })

    this.sunSignElement.innerHTML = horoscope.sunSign.Name

    this.midheavenElement.innerHTML = `${horoscope.Midheaven.DecimalDegrees} || ${horoscope.Midheaven.Sign.Name} ${horoscope.Midheaven.ArcDegreesFormatted}`

    this.ascendantElement.innerHTML = `${horoscope.Ascendant.DecimalDegrees} || ${horoscope.Ascendant.Sign.Name} ${horoscope.Ascendant.ArcDegreesFormatted}`

    horoscope.houseCusps.forEach((cusp, index) => {
      document.querySelector(`#house-${index + 1}a`).innerHTML = cusp.DecimalDegrees
      document.querySelector(`#house-${index + 1}b`).innerHTML = `${cusp.Sign.Name} ${cusp.ArcDegreesFormatted}`
    })
  }
}


new DemoApp()

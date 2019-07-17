import uuidv4 from 'uuid'
import { findMinMax, calcErrors, calcAverage } from '../utils'

// states
const PENDING = 'PENDING'
const LOADING = 'LOADING'
const ERROR = 'ERROR'
const FINISHED = 'FINISH'
const STOPPED = 'STOPPED'
const getTiming = (instance, callback) => {
  instance.interceptors.request.use(request => {
    request.ts = performance.now()
    return request
  })

  instance.interceptors.response.use(response => {
    callback(Math.ceil(Number(performance.now() - response.config.ts)))
    return response
  })
}
const parseResult = (result, latency) => {
  if (result) {
    return { status: result.status, payload: result.data ? result.data : {}, latency }
  } else {
    return { status: 0, payload: {}, latency }
  }
}
export class WaterfallRequestFSM {
  constructor (client, headers, path, updateLatency, updateResult) {
    this.id = uuidv4()
    this.updateLatency = updateLatency
    this.updateResult = updateResult
    this.status = PENDING
    this.response = null
    this.client = client
    this.headers = headers
    this.path = path
    this.latency = null
    this.duration = null
    this.resolve()
    this.manageRequest(this.status)
  }
  manageRequest (status) {
    switch (status) {
      case LOADING:
        return this.handleRequestLoading()
      case PENDING:
        return this.handleRequestLoading()
      case FINISHED:
        return this.handleRequestFinished()
      case ERROR:
        return this.handleRequestError()
      case STOPPED:
        return false
      default:
        return this.handleRequestLoading()
    }
  }
  handleRequestLoading () {
    this.duration = this.getDuration()
    this.updateStateCallback && this.updateStateCallback(this.getState())
  }
  handleRequestFinished () {
    clearInterval(this.timer)
    this.latency = this.getDuration()
    this.duration = this.latency
    this.response = parseResult(this.result, this.latency) 
    this.updateLatency([this.latency, this.response.status])
    this.updateResult(this.response)
    this.updateStateCallback && this.updateStateCallback(this.getState())
    this.restart()
  }
  handleRequestError () {
    clearInterval(this.timer)
    this.latency = this.getDuration()
    this.duration = this.latency
    this.response = parseResult(this.result, this.latency) 
    this.updateLatency([this.latency, this.response.status])
    this.updateResult(this.response)
    this.updateStateCallback && this.updateStateCallback(this.getState())
    this.restart()
  }
  setLatency (latency) {
    this.latency = latency
  }
  initialise () {
    this.status = PENDING
    this.response = {}
    this.startTime = performance.now()
  }
  preDestroy () {
    this.restartDelay && clearTimeout(this.restartDelay)
    this.timer && clearInterval(this.timer)
    this.status = STOPPED
    this.client.cancelRequest()
  }
  restart () {
    if (this.status === STOPPED) {
      return false
    }
    this.restartDelay = setTimeout(
      () => {
        this.status = LOADING
        this.resolve()
        this.manageRequest(this.status)
      },
      this.duration <= 1000 ? 1000 - this.duration : 10
    )
  }
  resolve (path = this.path) {
    this.initialise()
    this.status = LOADING
    getTiming(this.client.request, latency => this.setLatency(latency))
    this.client
      .get(`${path}/?${uuidv4()}-${Math.random()}`, this.headers)
      .then(result => {
        if (this.status === STOPPED) {
          this.manageRequest(this.status)
        } else {
          this.status = FINISHED
          this.result = result
          this.manageRequest(this.status)
        }
      })
      .catch(err => {
        if (this.status === STOPPED) {
          this.manageRequest(this.status)
        } else {
          this.status = ERROR
          if (err.response) {
            this.result = err.response
          }
          this.manageRequest(this.status)
        }
      })
  }
  getDuration () {
    switch (this.status) {
      case FINISHED:
        return this.latency
      case ERROR:
        return Math.ceil(Number(performance.now() - this.startTime))
      default:
        return Math.ceil(Number(performance.now() - this.startTime))
    }
  }
  getState () {
    return {
      status: this.status,
      duration: this.getDuration(),
      id: this.id
    }
  }
  getSatus () {
    return this.status
  }
  isFinished () {
    return this.status === FINISHED || this.status === ERROR
  }
  getId () {
    return this.id
  }
  updateCallback (callback) {
    this.updateStateCallback = state => callback(state)
  }
}

export class WaterfallManager {
  constructor (client, headers, path, updateStatsCallback, updateResultCallback) {
    this.client = client
    this.headers = headers
    this.path = path
    this.updateStatsCallback = updateStatsCallback
    this.updateResultCallback = updateResultCallback
    this.streams = []
    this.latencyResults = []
    this.latency = {}
    this.streamState = {}
    this.statsChecker = setInterval(() => this._updateStats(), 1000)
  }
  addStream () {
    const newStream = new WaterfallRequestFSM(
      this.client,
      this.headers,
      this.path,
      latency => this._updateLatency(latency),
      result => this._updateResult(result)
    )
    this.streams.push(newStream)
    return [newStream, this.streams.length - 1]
  }
  removeStream () {
    const stream = this.streams.pop()
    stream.preDestroy()
    return stream
  }
  _updateLatency (latency) {
    var newResults = this.latencyResults
    if (!this.latencyResults || !this.streams) {
      return false
    }
    if (this.latencyResults.length >= this.streams.length) {
      this.latencyResults.shift()
      newResults.push(latency)
      this.latencyResults = newResults
    } else {
      newResults.push(latency)
      this.latencyResults = newResults
    }
  }
  _updateResult(result) {
    this.updateResultCallback(result)
  }
  _generateStats = results => {
    const minMax = results.length > 0 ? findMinMax(results) : [0, 0]
    return {
      average: calcAverage(results),
      min: minMax[0],
      max: minMax[1],
      errors: calcErrors(results), 
      timestamp: Date.now()
    }
  }
  _updateStats () {
    this.latency = this._generateStats(this.latencyResults)
    this.updateStatsCallback(this.latency)
  }
  getStreamCallback (index) {
    return cb => this.streams[index].updateCallback(cb)
  }
  getStats () {
    return this.latency
  }
  preDestroy () {
    this.stateChecker && clearInterval(this.stateChecker)
    this.statsChecker && clearInterval(this.statsChecker)
    for (var i = 0; i < this.streams.length; i++) {
      this.streams[i].preDestroy()
    }
    delete this.streams
    delete this.updateStatsCallback
  }
  preDestroyStream (index) {
    this.streams && this.streams[index] && this.streams[index].preDestroy()
  }
}

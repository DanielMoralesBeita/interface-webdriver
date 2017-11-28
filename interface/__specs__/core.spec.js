const { expect } = require('chai')

const { Keys } = require('../event/keys')

const {
  resizeWindow,
  initSession,
  killSession,
  findElements,
  findElement,
  goToUrl,
  getUrl,
  getTitle,
  clickElement,
  sendKeys,
  getAttribute,
  executeScript,
  sleep,
  syncWithDOM,
  getElementText,
  moveTo,
  mouseDown
} = require('../core')

describe('core function positive scenario', () => {
  //test variables
  let sessionId = null
  let elementButton = null
  let elementInput_firstname = null
  let elementInput_lastname = null
  const baseURL = 'http://localhost:9090'
  const testString1 = 'test 1'
  const testString2 = 'test 2'
  //css selectors
  const firstname = '[placeholder="firstname"]'
  const lastname = '[placeholder="lastname"]'
  const addnewname = 'button'
  //mouse down mouse move mouse up
  const bar3 = '.bar.bar-0'
  const handler = '.my-handle'

  it('get sessionId', async () => {
    const body = await initSession()
    expect(body.status).to.eql(0)
    expect(body.sessionId).to.be.exist
    sessionId = body.sessionId
  })

  it('go to url', async () => {
    const body = await goToUrl(sessionId, baseURL)
    expect(body.sessionId).to.eql(sessionId)
    expect(body.status).to.eql(0)
    expect(body.value).to.eql(null)
  })

  it('get url', async () => {
    const body = await getUrl(sessionId)
    expect(body.sessionId).to.eql(sessionId)
    expect(body.status).to.eql(0)
    expect(body.value).to.eql(`${baseURL}/`)
  })

  it('get element (input)', async () => {
    {
      const body = await findElement(sessionId, firstname)
      expect(body.status).to.eql(0)
      expect(body.sessionId).to.eql(sessionId)
      expect(body.value.ELEMENT).to.be.exist
      elementInput_firstname = body.value.ELEMENT
    }
    {
      const body = await findElement(sessionId, lastname)
      expect(body.status).to.eql(0)
      expect(body.sessionId).to.eql(sessionId)
      expect(body.value.ELEMENT).to.be.exist
      elementInput_lastname = body.value.ELEMENT
    }
  })

  it('get element (button)', async () => {
    const body = await findElement(sessionId, addnewname)
    expect(body.status).to.eql(0)
    expect(body.sessionId).to.eql(sessionId)
    expect(body.value.ELEMENT).to.be.exist
    elementButton = body.value.ELEMENT
  })

  it('get elements (buttons)', async () => {
    const body = await findElements(sessionId, addnewname)
    expect(body.status).to.eql(0)
    expect(body.sessionId).to.eql(sessionId)
    expect(body.value.length).to.eql(9)
    expect(body.value[0].ELEMENT).to.be.exist
    expect(body.value[0].ELEMENT).to.eql(elementButton)
  })

  it('send keys to input (1)', async () => {
    const body = await sendKeys(sessionId, elementInput_firstname, testString1)
    expect(body.status).to.eql(0)
    expect(body.sessionId).to.eql(sessionId)
    expect(body.value).to.eql(null)
  })

  it('get value from input (1)', async () => {
    const body = await getAttribute(sessionId, elementInput_firstname, 'value')
    expect(body.status).to.eql(0)
    expect(body.sessionId).to.eql(sessionId)
    expect(body.value).to.eql(testString1)
  })

  it('send keys to input (2)', async () => {
    const body = await sendKeys(sessionId, elementInput_lastname, testString2)
    expect(body.status).to.eql(0)
    expect(body.sessionId).to.eql(sessionId)
    expect(body.value).to.eql(null)
  })

  it('get value from input (2)', async () => {
    const body = await getAttribute(sessionId, elementInput_lastname, 'value')
    expect(body.status).to.eql(0)
    expect(body.sessionId).to.eql(sessionId)
    expect(body.value).to.eql(testString2)
  })

  it('combine data', async () => {
    let elements
    const elValue = []
    const elementSelector = '[draggable="true"]'
    {
      const body = await findElements(sessionId, elementSelector)
      expect(body.status).to.eql(0)
      expect(body.sessionId).to.eql(sessionId)
      expect(body.value.length).to.eql(9)
      elements = body.value
    }
    {
      for (let item of elements) {
        const body = await getElementText(sessionId, item.ELEMENT)
        expect(body.status).to.eql(0)
        expect(body.sessionId).to.eql(sessionId)
        expect(body.value).to.be.exist
        elValue.push(body.value)
      }
    }
  })

  it('combine data by execute script', async () => {
    {
      const body = await executeScript(sessionId, function () {
        const elValue = []
        document.querySelectorAll('[draggable="true"]').forEach(item => {
          elValue.push(item.innerText)
        })
        return elValue
      })
      expect(body.status).to.eql(0)
      expect(body.sessionId).to.eql(sessionId)
      expect(body.value).to.be.exist
    }
  })

  it('execute script', async () => {
    {
      const body = await executeScript(sessionId, function () {
        return document.body.baseURI
      })
      expect(body.status).to.eql(0)
      expect(body.sessionId).to.eql(sessionId)
      expect(body.value).to.eql(`${baseURL}/`)
    }
    {
      const body = await executeScript(sessionId, 'return document.querySelector(arguments[0]).placeholder', lastname)
      expect(body.status).to.eql(0)
      expect(body.sessionId).to.eql(sessionId)
      expect(body.value).to.eql('lastname')
    }
  })

  it('mouse down move up', async () => {
    let initialStyle = null
    let changedStyleValue = null
    {
      //get initial style
      const body = await getAttribute(sessionId, bar3, 'style')
      expect(body.status).to.eql(0)
      expect(body.sessionId).to.eql(sessionId)
      expect(body.value).to.be.exist
      initialStyle = body.value
    }
    {
      //mouse down mouse move mouse up
      const { value: { ELEMENT } } = await findElement(sessionId, handler)
      const bodyMouseMoveTo = await moveTo(sessionId, { element: ELEMENT })
      const bodyMouseDown = await mouseDown(sessionId, handler)
      const bodyMouseMove = await moveTo(sessionId, { x: 60, y: 0 })
    }
    {
      const body = await getAttribute(sessionId, bar3, 'style')
      expect(body.status).to.eql(0)
      expect(body.sessionId).to.eql(sessionId)
      expect(body.value).to.be.exist
      changedStyleValue = body.value
    }
    {
      expect(changedStyleValue).to.not.eql(initialStyle)
    }
  })

  it('send keys with enter', async () => {
    let elementInput = null
    let elementInputValue = null
    let apearDisapearField = null
    const enterInput = '[placeholder="KEY ENTER"]'
    const apearDisapearFieldSelector = '.apear.disapear'
    {
      const body = await findElement(sessionId, enterInput)
      expect(body.status).to.eql(0)
      expect(body.sessionId).to.eql(sessionId)
      expect(body.value.ELEMENT).to.be.exist
      elementInput = body.value.ELEMENT
    }
    {
      await sendKeys(sessionId, elementInput, testString1)
      const body = await sendKeys(sessionId, elementInput, Keys.ENTER)
      expect(body.status).to.eql(0)
      expect(body.sessionId).to.eql(sessionId)
      expect(body.value).to.eql(null)
    }
    {
      const body = await findElement(sessionId, apearDisapearFieldSelector)
      expect(body.status).to.eql(0)
      expect(body.sessionId).to.eql(sessionId)
      expect(body.value.ELEMENT).to.be.exist
      apearDisapearField = body.value.ELEMENT
    }
    {
      const body = await getElementText(sessionId, apearDisapearField)
      expect(body.status).to.eql(0)
      expect(body.sessionId).to.eql(sessionId)
      expect(body.value).to.be.exist
      expect(body.value).to.eql(testString1)
    }
  })

  it('kill session', async () => {
    const body = await killSession(sessionId)
    expect(body.status).to.eql(0)
    expect(body.sessionId).to.eql(sessionId)
    expect(body.value).to.eql(null)
  })
})

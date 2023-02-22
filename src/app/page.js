'use client'
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import InputGroup from 'react-bootstrap/InputGroup'
import Spinner from 'react-bootstrap/Spinner';
import axios from 'axios';

import { useState, useEffect } from 'react'

function DisplayCEP(props) {
  const [emojis, setEmojis] = useState([])

  useEffect(() => {
    const array = ["🛤️", "⛱","🌫️", "⛰","⌚", "☘", "👌", "🏭", "⌨", "✂", "🏵", "📺"]
    setEmojis([...array].sort(() => 0.5 - Math.random()))
  }, [])

  let errorElem = null
  if (props.data.error) {
      errorElem =
        <div>
          <div class="cep-info bg-danger text-white ps-2">ERROR </div>
          <div class="cep-text">❌ {props.data.error}</div>
        </div>
  }

  return <>
    <div className="flex-container">
      {Object.keys(props.data).map((e, index) => (
        errorElem ||
        <div key={index} className="flex-container-div border rounded border-top-0">
          <div class="cep-info">{emojis[index]} {e.replace(e.charAt(0), e.charAt(0).toUpperCase())}</div>
          <div class="cep-text">{props.data[e]}</div>
        </div>
      ))}
    </div>
  </>
}

export default function Home() {
  const [cepUser, setCepUser] = useState("")
  const [cepData, setCepData] = useState({})
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    try {
      const cepInfo = await axios.get(`/api/cep/${cepUser}`)
      setCepData(cepInfo.data)
    } catch (e) {
      setCepData({ error: e.response.data.error})
    }

    setLoading(false)
    setCepUser("")
  }
  return (
    <>
      <Container>
        <Row className="mt-5 justify-content-center align-items-center">
          <Col>
            <h1>CEPify</h1>
            <Form onSubmit={handleSubmit}>
              <InputGroup>
                <Form.Control
                  type="text"
                  name="cep"
                  required={true}
                  minLength={8}
                  maxLength={8}
                  value={cepUser}
                  placeholder="Ex: 38010030"
                  onChange={(e) => setCepUser(e.target.value)}
                />
                <Button type="submit">Ver CEP!</Button>
              </InputGroup>
              <Form.Text className="text-muted" >CEP deve ser válido sem o uso de letras ou digitos</Form.Text>
              <Spinner
                className="mt-3"
                animation="border"
                role="status"
                variant="secondary"
                style={{display: loading ? 'block' : 'none'}}
                >
                <span className="visually-hidden">Loading...</span>
              </Spinner>
              <div className="mt-5">
                {cepData ? <DisplayCEP data={cepData} /> : null}
              </div>
            </Form>
          </Col>
        </Row>
      </Container>
    </>
  )
}

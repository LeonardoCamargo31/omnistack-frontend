import React, { Component } from 'react';
import api from '../../services/api'

import { distanceInWords } from 'date-fns'
import pt from 'date-fns/locale/pt'
import DropeZone from 'react-dropzone'
import { MdInsertDriveFile } from 'react-icons/md'
import socket from 'socket.io-client'

import logo from '../../assets/logo.svg'
import './styles.css';

export default class box extends Component {

  state = { box: {} }

  async componentDidMount() {
    this.subscribeToNewFiles()
    const box = this.props.match.params.id
    const response = await api.get(`boxes/${box}`)

    this.setState({ box: response.data })
  }

  subscribeToNewFiles = () => {
    const box = this.props.match.params.id
    const io = socket('https://semana-omnistack-backend.herokuapp.com')
    io.emit('connectRoom', box)//lá na api espero que ele emita essa connectRoom passando o id da box, para se conectar a sala
    io.on('file', data => {//fazendo um upload dispara uma mensagem de tipo file, para todos os inscritos da box
      //...this.state.box clonando tudo que já tem em box, clono tudo dentro de files, e adicionando o novo arquivo
      this.setState({ box: {...this.state.box, files: [data,...this.state.box.files] } })
    })
  }

  handleUpload = (files) => {
    files.forEach(file => {
      const data = new FormData()//esse form data ele simula um form
      const box = this.props.match.params.id

      data.append('file', file)

      api.post(`boxes/${box}/files`, data)
    })
  }

  render() {
    return (
      <div id="box-container">
        <header>
          <img src={logo} />
          <h1>{this.state.box.title}</h1>
        </header>

        <DropeZone onDropAccepted={this.handleUpload}>
          {({ getRootProps, getInputProps }) => (
            <div className="upload" {...getRootProps()}>
              <input {...getInputProps()} />
              <p>Arraste arquivos ou clique aqui</p>
            </div>
          )}
        </DropeZone>

        <ul>
          {this.state.box.files && this.state.box.files.map(file => (
            <li key={file._id}>
              <a className="fileInfo" href={file.url}>
                <MdInsertDriveFile size={24} color="#a5cfff" />
                <strong>{file.title}</strong>
              </a>
              <span>há{" "}{distanceInWords(file.createdAt, new Date(), { locale: pt })}</span>
            </li>
          ))}
        </ul>
      </div>
    )
  }
}

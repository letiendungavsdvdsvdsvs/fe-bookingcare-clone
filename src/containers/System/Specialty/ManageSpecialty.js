import React, { Component } from 'react';
import { connect } from "react-redux";
import './ManageSpecialty.scss'
import MarkdownIt from 'markdown-it';
import MdEditor from 'react-markdown-editor-lite';
import { CommonUtils } from '../../../utils';
import { postCreateNewSpecialty } from '../../../services/userService';
import { toast } from 'react-toastify'

const mdParser = new MarkdownIt();


class ManageSpecialty extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: '',
            imgBase64: '',
            contentHTML: '',
            contentMarkdown: ''
        }
    }

    async componentDidMount() {



    }



    async componentDidUpdate(prevProps, prevState) {
        if (this.props.language !== prevProps.language) {

        }

    }

    handleOnChangeInput = (event, id) => {
        let stateCopy = { ...this.state }
        stateCopy[id] = event.target.value
        this.setState({
            ...stateCopy
        })
    }

    handleEditorChange = ({ html, text }) => {
        this.setState({
            contentMarkdown: text,
            contentHTML: html
        })
    }

    handleOnchangeImage = async (event) => {
        let data = event.target.files;
        let file = data[0];
        if (file) {
            let base64 = await CommonUtils.getBase64(file);
            this.setState({
                imgBase64: base64
            })
        }

    }

    handleSaveNewSpecialty = async () => {
        let res = await postCreateNewSpecialty(this.state)
        if (res && res.errCode === 0) {
            toast.success('Add new specialty success!')
            this.setState({
                name: '',
                imgBase64: '',
                contentHTML: '',
                contentMarkdown: ''
            })
        } else {
            toast.error('Add new specialty failed!')
        }
    }

    render() {

        return (
            <div className='manage-specialty-container'>
                <div className='ms-title'>Manage specialty</div>
                <div className='add-new-specialty row'>
                    <div className='col-6 form-group'>
                        <label>Name of Specialty</label>
                        <input className='form-control' type='text' value={this.state.name}
                            onChange={(event) => this.handleOnChangeInput(event, 'name')}
                        />
                    </div>
                    <div className='col-6 form-group'>
                        <label>Image of Specialty</label>
                        <input className='form-control-file' type='file'
                            onChange={(event) => this.handleOnchangeImage(event)}
                        />
                    </div>
                    <div className='col-12'>
                        <MdEditor style={{ height: "300px" }}
                            renderHTML={text => mdParser.render(text)}
                            onChange={this.handleEditorChange}
                            value={this.state.contentMarkdown}
                        />
                    </div>
                    <div className='col-12'>
                        <button className='btn-save-specialty'
                            onClick={() => this.handleSaveNewSpecialty()}
                        >Save</button>
                    </div>
                </div>

            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        language: state.app.language
    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ManageSpecialty);

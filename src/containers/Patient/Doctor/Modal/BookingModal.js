import React, { Component } from 'react';
import { connect } from "react-redux";
import { FormattedMessage } from 'react-intl';
import './BookingModal.scss';
import { Modal, Toast } from "reactstrap";
import ProfileDoctor from '../ProfileDoctor';
import _ from 'lodash'
import DatePicker from '../../../../components/Input/DatePicker';
import * as actions from '../../../../store/actions'
import { languages } from '../../../../utils';
import Select from 'react-select'
import { postPatientBooking } from '../../../../services/userService';
import { toast } from 'react-toastify';
import moment from 'moment';
import LoadingOverlay from 'react-loading-overlay';

class BookingModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            fullname: '',
            phonenumber: '',
            email: '',
            address: '',
            reason: '',
            birthday: '',
            genders: '',
            doctorId: '',
            selectedGender: '',
            timeType: '',
            isShowLoading: false
        }
    }

    async componentDidMount() {
        this.props.fetchGender()


    }

    buildDataGender = (data) => {
        let result = []
        let { language } = this.props
        if (data && data.length > 0) {
            data.map(item => {
                let obj = {}
                obj.label = language === languages.VI ? item.valueVi : item.valueEn
                obj.value = item.keyMap
                result.push(obj)
            })
        }
        return result
    }

    async componentDidUpdate(prevProps, prevState) {
        if (this.props.language !== prevProps.language) {
            this.setState({
                genders: this.buildDataGender(this.props.genders)
            })
        }
        if (this.props.genders !== prevProps.genders) {
            this.setState({
                genders: this.buildDataGender(this.props.genders)
            })
        }
        if (this.props.dataScheduleTimeModal !== prevProps.dataScheduleTimeModal) {
            if (this.props.dataScheduleTimeModal && !_.isEmpty(this.props.dataScheduleTimeModal)) {
                let doctorId = this.props.dataScheduleTimeModal.doctorId
                let timeType = this.props.dataScheduleTimeModal.timeType
                this.setState({
                    doctorId: doctorId,
                    timeType: timeType
                })
            }
        }

    }

    handleOnChangeInput = (event, id) => {
        let valueInput = event.target.value
        let stateCopy = { ...this.state }
        stateCopy[id] = valueInput
        this.setState({
            ...stateCopy
        })
    }

    handleOnChangDatePicker = (date) => {
        this.setState({
            birthday: date[0]
        })
    }

    handleOnChangeSelect = (selectedOption) => {
        this.setState({
            selectedGender: selectedOption
        })
    }

    handleConfirmBooking = async () => {
        this.setState({
            isShowLoading: true
        })
        let date = new Date(this.state.birthday).getTime()
        let timeString = this.buildTimeBooking(this.props.dataScheduleTimeModal)
        let doctorName = this.buildDoctorName(this.props.dataScheduleTimeModal)
        let res = await postPatientBooking({
            fullname: this.state.fullname,
            phonenumber: this.state.phonenumber,
            email: this.state.email,
            address: this.state.address,
            reason: this.state.reason,
            date: this.props.dataScheduleTimeModal.date,
            birthday: date,
            selectedGender: this.state.selectedGender.value,
            doctorId: this.state.doctorId,
            genders: this.state.genders,
            timeType: this.state.timeType,
            language: this.props.language,
            timeString: timeString,
            doctorName: doctorName
        })
        this.setState({
            isShowLoading: false
        })
        if (res && res.errCode === 0) {
            toast.success('Booking succeed !')
            this.props.closeBookingModal()
        } else {
            toast.error('Booking failed !')
        }
    }

    buildTimeBooking = (dataScheduleTimeModal) => {
        let { language } = this.props
        let time = language === languages.VI ? dataScheduleTimeModal.timeTypeData.valueVi
            :
            dataScheduleTimeModal.timeTypeData.valueEn
        let date = language === languages.VI ?
            moment.unix(+dataScheduleTimeModal.date / 1000).format('dddd - DD/MM/YYYY')
            :
            moment.unix(+dataScheduleTimeModal.date / 1000).locale('en').format('ddd - MM/DD/YYYY')
        if (dataScheduleTimeModal && !_.isEmpty(dataScheduleTimeModal)) {
            return `${time} - ${date}`
        }
    }

    buildDoctorName = (dataScheduleTimeModal) => {
        let { language } = this.props
        if (dataScheduleTimeModal && !_.isEmpty(dataScheduleTimeModal)) {
            let name = language === languages.VI ?
                `${dataScheduleTimeModal.doctorData.lastName} ${dataScheduleTimeModal.doctorData.firstName}`
                :
                `${dataScheduleTimeModal.doctorData.firstName} ${dataScheduleTimeModal.doctorData.lastName}`
            return name
        }
    }

    render() {
        let { isOpenModal, closeBookingModal, dataScheduleTimeModal } = this.props
        let doctorId = ''
        if (dataScheduleTimeModal && !_.isEmpty(dataScheduleTimeModal)) {
            doctorId = dataScheduleTimeModal.doctorId
        }
        return (
            <LoadingOverlay
                active={this.state.isShowLoading}
                spinner
                text='Loading ...'
            >
                <Modal
                    isOpen={isOpenModal}
                    className={'booking-modal-container'}
                    size='lg'
                    centered
                >
                    <div className='booking-modal-content'>
                        <div className='booking-modal-header'>
                            <span className='left'><FormattedMessage id='patient.booking-modal.title' /></span>
                            <span className='right'
                                onClick={closeBookingModal}
                            ><i className='fas fa-times'></i></span>
                        </div>
                        <div className='booking-modal-body'>
                            {/* {JSON.stringify(dataScheduleTimeModal)} */}
                            <div className='doctor-info'>
                                <ProfileDoctor doctorId={doctorId}
                                    isShowDescriptionDoctor={false}
                                    dataScheduleTimeModal={dataScheduleTimeModal}
                                    isShowLinkDetail={false}
                                    isShowPrice={true}
                                />
                            </div>
                            <div className='row'>
                                <div className='col-6 form-group'>
                                    <label><FormattedMessage id='patient.booking-modal.fullname' /></label>
                                    <input className='form-control'
                                        value={this.state.fullname}
                                        onChange={(event) => this.handleOnChangeInput(event, 'fullname')}
                                    />
                                </div>
                                <div className='col-6 form-group'>
                                    <label><FormattedMessage id='patient.booking-modal.phonenumber' /></label>
                                    <input className='form-control'
                                        value={this.state.phonenumber}
                                        onChange={(event) => this.handleOnChangeInput(event, 'phonenumber')}
                                    />
                                </div>
                                <div className='col-6 form-group'>
                                    <label><FormattedMessage id='patient.booking-modal.email' /></label>
                                    <input className='form-control'
                                        value={this.state.email}
                                        onChange={(event) => this.handleOnChangeInput(event, 'email')}
                                    />
                                </div>
                                <div className='col-6 form-group'>
                                    <label><FormattedMessage id='patient.booking-modal.address' /></label>
                                    <input className='form-control'
                                        value={this.state.address}
                                        onChange={(event) => this.handleOnChangeInput(event, 'address')}
                                    />
                                </div>
                                <div className='col-12 form-group'>
                                    <label><FormattedMessage id='patient.booking-modal.reason' /></label>
                                    <input className='form-control'
                                        value={this.state.reason}
                                        onChange={(event) => this.handleOnChangeInput(event, 'reason')}
                                    />
                                </div>
                                <div className='col-6 form-group'>
                                    <label><FormattedMessage id='patient.booking-modal.birthday' /></label>
                                    <DatePicker
                                        onChange={this.handleOnChangDatePicker}
                                        className='form-control'
                                        value={this.state.birthday}
                                        maxDate={new Date().setHours(0, 0, 0, 0)}
                                    />
                                </div>
                                <div className='col-6 form-group'>
                                    <label><FormattedMessage id='patient.booking-modal.gender' /></label>
                                    <Select
                                        value={this.state.selectedGender}
                                        onChange={this.handleOnChangeSelect}
                                        options={this.state.genders}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className='booking-modal-footer'>
                            <button className='btn-booking-confirm' onClick={() => this.handleConfirmBooking()}>
                                <FormattedMessage id='patient.booking-modal.confirm' />
                            </button>
                            <button className='btn-booking-cancel' onClick={closeBookingModal}>
                                <FormattedMessage id='patient.booking-modal.cancel' />
                            </button>
                        </div>
                    </div>
                </Modal>
            </LoadingOverlay>
        );
    }
}

const mapStateToProps = state => {
    return {
        language: state.app.language,
        genders: state.admin.genders
    };
};

const mapDispatchToProps = dispatch => {
    return {
        fetchGender: () => dispatch(actions.fetchGenderStart())
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(BookingModal);

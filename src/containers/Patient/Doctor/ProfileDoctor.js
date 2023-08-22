import React, { Component } from 'react';
import { connect } from "react-redux";
import { FormattedMessage } from 'react-intl';
import './ProfileDoctor.scss';
import { getProfileDoctorById } from '../../../services/userService';
import { languages } from '../../../utils';
import NumberFormat from 'react-number-format';
import _ from 'lodash'
import moment from 'moment/moment';
import { Link } from 'react-router-dom'

class ProfileDoctor extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataProfile: {}
        }
    }

    async componentDidMount() {
        let data = await this.getInfoDoctor(this.props.doctorId)
        this.setState({
            dataProfile: data
        })
    }

    getInfoDoctor = async (id) => {
        let result = {}
        if (id) {
            let res = await getProfileDoctorById(id)
            if (res && res.errCode === 0) {
                result = res.data
            }
        }
        return result
    }

    async componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.language !== prevProps.language) {
        }
        if (this.props.doctorId !== prevProps.doctorId) {
            let data = await this.getInfoDoctor(this.props.doctorId);
            this.setState({
                dataProfile: data,
            });
        }
    }

    renderTimeBooking = (dataScheduleTimeModal) => {
        let { language } = this.props
        let time = language === languages.VI ? dataScheduleTimeModal.timeTypeData.valueVi : dataScheduleTimeModal.timeTypeData.valueEn
        let date = language === languages.VI ?
            moment.unix(+dataScheduleTimeModal.date / 1000).format('dddd - DD/MM/YYYY')
            :
            moment.unix(+dataScheduleTimeModal.date / 1000).locale('en').format('ddd - MM/DD/YYYY')
        if (dataScheduleTimeModal && !_.isEmpty(dataScheduleTimeModal)) {
            return (
                <>
                    <div>{time} - {date}</div>
                    <div><FormattedMessage id='patient.profile-doctor.title-extra' /></div>
                </>
            )
        }
    }

    render() {
        let { language, isShowDescriptionDoctor, dataScheduleTimeModal, isShowLinkDetail, isShowPrice, doctorId } = this.props
        let { dataProfile } = this.state
        let nameEn = '', nameVi = ''
        if (dataProfile && dataProfile.positionData) {
            nameVi = `${dataProfile.positionData.valueVi}, ${dataProfile.lastName} ${dataProfile.firstName}`
            nameEn = `${dataProfile.positionData.valueEn}, ${dataProfile.firstName} ${dataProfile.lastName}`
        }
        return (
            <div className='profile-doctor-container'>
                <div className='intro-doctor'>
                    <div className='content-left'
                        style={{ backgroundImage: `url(${dataProfile && dataProfile.image ? dataProfile.image : ''})` }}
                    >

                    </div>
                    <div className='content-right'>
                        <div className='up'>
                            {language === languages.VI ? nameVi : nameEn}
                        </div>
                        <div className='down'>
                            {isShowDescriptionDoctor === true ?
                                <>
                                    {dataProfile && dataProfile.Markdown && dataProfile.Markdown.description &&
                                        <span>
                                            {dataProfile.Markdown.description}
                                        </span>
                                    }
                                </>
                                :
                                <>
                                    {this.renderTimeBooking(dataScheduleTimeModal)}
                                </>
                            }
                        </div>
                    </div>
                </div>
                {isShowLinkDetail === true &&
                    <div className='view-detail-doctor'>
                        <Link to={`/info-doctor/${doctorId}`}>Xem thêm</Link>
                    </div>}
                {isShowPrice === true &&
                    <div className='price'>
                        <FormattedMessage id='patient.profile-doctor.price' />
                        {dataProfile && dataProfile.Doctor_Info && language === languages.VI &&
                            <NumberFormat
                                className='currency'
                                value={dataProfile.Doctor_Info.priceTypeData.valueVi}
                                displayType='text'
                                thousandSeparator={true}
                                suffix='VND'
                            />
                        }
                        {dataProfile && dataProfile.Doctor_Info && language === languages.EN &&
                            <NumberFormat
                                className='currency'
                                value={dataProfile.Doctor_Info.priceTypeData.valueEn}
                                displayType='text'
                                thousandSeparator={true}
                                suffix='$'
                            />
                        }
                    </div>
                }
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

export default connect(mapStateToProps, mapDispatchToProps)(ProfileDoctor);

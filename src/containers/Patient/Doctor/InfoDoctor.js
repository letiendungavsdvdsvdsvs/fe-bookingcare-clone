import React, { Component } from 'react';
import { connect } from "react-redux";
import HomeHeader from '../../HomePage/HomeHeader';
import './InfoDoctor.scss';
import { getInfoDoctorService } from '../../../services/userService'
import { languages } from '../../../utils';
import DoctorSchedule from './DoctorSchedule';
import DoctorExtraInfo from './DoctorExtraInfo';
import LikeAndShare from '../SocialPlugin/LikeAndShare'
import Comment from '../SocialPlugin/Comment'


class InfoDoctor extends Component {
    constructor(props) {
        super(props);
        this.state = {
            infoDoctor: {},
            currentDoctorId: -1
        }
    }

    async componentDidMount() {
        if (this.props.match && this.props.match.params && this.props.match.params.id) {
            this.setState({
                currentDoctorId: this.props.match.params.id
            })
            let res = await getInfoDoctorService(this.props.match.params.id);
            if (res && res.errCode === 0) {
                this.setState({
                    infoDoctor: res.data,

                })
            }
        }
    }

    componentDidUpdate(prevProps, prevState) {

    }

    render() {
        let { infoDoctor } = this.state;
        let { language } = this.props;
        let nameVi = '', nameEn = '';
        if (infoDoctor && infoDoctor.positionData) {
            nameVi = `${infoDoctor.positionData.valueVi}, ${infoDoctor.lastName} ${infoDoctor.firstName}`
            nameEn = `${infoDoctor.positionData.valueEn}, ${infoDoctor.firstName} ${infoDoctor.lastName}`
        }


        return (
            <>
                <HomeHeader
                    isShowBanner={false}
                />
                <div className='info-doctor-container'>
                    <div className='intro-doctor'>
                        <div className='content-left'
                            style={{ backgroundImage: `url(${infoDoctor && infoDoctor.image ? infoDoctor.image : ''})` }}
                        >

                        </div>
                        <div className='content-right'>
                            <div className='up'>
                                {language === languages.VI ? nameVi : nameEn}
                            </div>
                            <div className='down'>

                                {infoDoctor && infoDoctor.Markdown && infoDoctor.Markdown.description &&
                                    <span>
                                        {infoDoctor.Markdown.description}
                                    </span>
                                }

                            </div>
                        </div>
                    </div>
                    <div className='schedule-doctor'>
                        <div className='content-left'>
                            <DoctorSchedule
                                doctorIdFromParent={this.state.currentDoctorId}
                            />
                        </div>
                        <div className='content-right'>
                            <DoctorExtraInfo
                                doctorIdFromParent={this.state.currentDoctorId}
                            />
                        </div>
                    </div>
                    <div className='info-doctor'>
                        {infoDoctor && infoDoctor.Markdown && infoDoctor.Markdown.contentHTML &&
                            <div dangerouslySetInnerHTML={{ __html: infoDoctor.Markdown.contentHTML }}>

                            </div>
                        }
                    </div>
                    <div className='comment-doctor'>

                    </div>

                </div>
            </>
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

export default connect(mapStateToProps, mapDispatchToProps)(InfoDoctor);

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';


class HomeFooter extends Component {

    render() {

        return (
            <div className='home-footer'>
                <p>&copy; 2023 BlackReaper <a target='_blank' href='https://www.google.com/search?q=gg+d%E1%BB%8Bch&rlz=1C1KNTJ_enVN1039VN1039&oq=&gs_lcrp=&sourceid=chrome&ie=UTF-8'>More infomation</a></p>
            </div>

        );
    }

}

const mapStateToProps = state => {
    return {
        isLoggedIn: state.user.isLoggedIn
    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(HomeFooter);

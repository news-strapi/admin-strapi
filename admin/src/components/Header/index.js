/**
 *
 * Header
 *
 */

import styled from 'styled-components';
import PropTypes from 'prop-types';

const Header = styled.div`
  width: 100%;
  height: ${props => props.theme.main.sizes.header.height};

  position: fixed;
  z-index: 1040;
  left: ${props => props.theme.main.sizes.leftMenu.width};

  box-shadow: rgb(40 42 49 / 9%) -1px 1px 0px 0px;
  background-color: ${props => props.theme.main.colors.white};

  line-height: ${props => props.theme.main.sizes.header.height};
`;

Header.defaultProps = {
  theme: {
    main: {
      colors: {},
      sizes: {
        header: {},
        leftMenu: {},
      },
    },
  },
};

Header.propTypes = {
  theme: PropTypes.object,
};

export default Header;

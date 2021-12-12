import React from 'react';
import PropTypes from 'prop-types';
import {CKEditor} from '@ckeditor/ckeditor5-react';
import ClassicEditor from 'ckeditor5-build-strapi-wysiwyg';
import styled from 'styled-components';
/*import 'ckeditor5-build-strapi-wysiwyg/build/translations/ar';
import 'ckeditor5-build-strapi-wysiwyg/build/translations/cs';
import 'ckeditor5-build-strapi-wysiwyg/build/translations/de';*/
import 'ckeditor5-build-strapi-wysiwyg/build/translations/es';
/*import 'ckeditor5-build-strapi-wysiwyg/build/translations/fr';
import 'ckeditor5-build-strapi-wysiwyg/build/translations/id';
import 'ckeditor5-build-strapi-wysiwyg/build/translations/it';
import 'ckeditor5-build-strapi-wysiwyg/build/translations/ko';
import 'ckeditor5-build-strapi-wysiwyg/build/translations/nl';
import 'ckeditor5-build-strapi-wysiwyg/build/translations/pl';
import 'ckeditor5-build-strapi-wysiwyg/build/translations/pt';
import 'ckeditor5-build-strapi-wysiwyg/build/translations/pt-br';
import 'ckeditor5-build-strapi-wysiwyg/build/translations/ru';
import 'ckeditor5-build-strapi-wysiwyg/build/translations/sk';
import 'ckeditor5-build-strapi-wysiwyg/build/translations/th';
import 'ckeditor5-build-strapi-wysiwyg/build/translations/tr';
import 'ckeditor5-build-strapi-wysiwyg/build/translations/uk';
import 'ckeditor5-build-strapi-wysiwyg/build/translations/vi';
import 'ckeditor5-build-strapi-wysiwyg/build/translations/zh';*/

import WebFont from 'webfontloader'

WebFont.load({
  google: {
    families: ['Open Sans:300,400,700, 800', 'sans-serif']
  }
});

const Wrapper = styled.div`
  .ck-editor__main {
    font-family: 'Open Sans', sans-serif;
    font-size: 16px;
    line-height: 1.76;
    background-color: #ffffff;
    min-height: 300px;
    max-height: 1300px;

    > div {
      min-height: 300px;
      max-height: 1300px;
    }

    p {
      margin-bottom: 1.5rem;
    }
  }

  //.ck-toolbar__items {
  //  .ck-button:last-child {
  //    margin-left: auto;
  //  }
  //}

  :not(#fullscreeneditor) {
    .ck.ck-sticky-panel .ck-sticky-panel__content_sticky {
      position: relative;
    }

    .ck-sticky-panel__placeholder {
      height: 0 !important;
    }

    .ck.ck-editor__top.ck-reset_all {
      position: sticky;
      top: 59px;
      z-index: 100;
    }
  }
`;

const Editor = ({onChange, name, value, config}) => {
  return (
    <Wrapper>
      <CKEditor
        editor={ClassicEditor}
        data={value}
        onReady={editor => {
          if (value) {
            editor.setData(value);
          }
        }}
        onChange={(event, editor) => {
          const data = editor.getData();
          onChange({target: {name, value: data}});
        }}
        config={{...config, language: 'es'}}
      />
    </Wrapper>
  );
};

Editor.propTypes = {
  onChange: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
  value: PropTypes.string,
};

export default Editor;

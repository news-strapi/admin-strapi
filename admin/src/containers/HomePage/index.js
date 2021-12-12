/*
 *
 * HomePage
 *
 */
/* eslint-disable */
import React, {memo, useMemo} from 'react';
import {FormattedMessage} from 'react-intl';
import {get, upperFirst} from 'lodash';
import {auth, LoadingIndicatorPage} from 'strapi-helper-plugin';
import PageTitle from '../../components/PageTitle';
import {useModels} from '../../hooks';

// import useFetch from './hooks';
import {ALink, Block, Container, P, Separator} from './components';
import SocialLink from './SocialLink';

const SOCIAL_LINKS = [
  {
    name: 'GitHub',
    link: 'https://github.com/strapi/strapi/',
  },
  {
    name: 'Slack',
    link: 'https://slack.strapi.io/',
  },
  {
    name: 'Medium',
    link: 'https://medium.com/@strapi',
  },
  {
    name: 'Twitter',
    link: 'https://twitter.com/strapijs',
  },
  {
    name: 'Reddit',
    link: 'https://www.reddit.com/r/Strapi/',
  },
  {
    name: 'Forum',
    link: 'https://forum.strapi.io',
  },
  {
    name: 'Academy',
    link: 'https://academy.strapi.io',
  },
];

const HomePage = ({history: {push}}) => {
  // const { error, isLoading, posts } = useFetch();
  // Temporary until we develop the menu API
  const {collectionTypes, singleTypes, isLoading: isLoadingForModels} = useModels();

  const hasAlreadyCreatedContentTypes = useMemo(() => {
    const filterContentTypes = contentTypes => contentTypes.filter(c => c.isDisplayed);

    return (
      filterContentTypes(collectionTypes).length > 1 || filterContentTypes(singleTypes).length > 0
    );
  }, [collectionTypes, singleTypes]);

  if (isLoadingForModels) {
    return <LoadingIndicatorPage/>;
  }

  const headerId = hasAlreadyCreatedContentTypes
    ? 'HomePage.greetings'
    : 'app.components.HomePage.welcome';
  const username = get(auth.getUserInfo(), 'firstname', '');

  return (
    <>
      <FormattedMessage id="HomePage.helmet.title">
        {title => <PageTitle title={title}/>}
      </FormattedMessage>

      <Container className="container-fluid">
        <div className="row">
          <div className="col-lg-8 col-md-12">
            <Block>
              <FormattedMessage
                id={headerId}
                values={{
                  name: upperFirst(username),
                }}
              >
                {msg => <h2 id="mainHeader">{msg}</h2>}
              </FormattedMessage>
            </Block>
          </div>

          <div className="col-md-12 col-lg-4">
            <Block style={{paddingRight: 30, paddingBottom: 0}}>
              <FormattedMessage id="HomePage.community">{msg => <h2>{msg}</h2>}</FormattedMessage>
              <FormattedMessage id="app.components.HomePage.community.content">
                {content => <P style={{marginTop: 7, marginBottom: 0}}>{content}</P>}
              </FormattedMessage>
              <FormattedMessage id="HomePage.roadmap">
                {msg => (
                  <ALink
                    rel="noopener noreferrer"
                    href="https://portal.productboard.com/strapi/1-public-roadmap/tabs/2-under-consideration"
                    target="_blank"
                  >
                    {msg}
                  </ALink>
                )}
              </FormattedMessage>

              <Separator style={{marginTop: 18}}/>

              <div
                className="row social-wrapper"
                style={{
                  display: 'flex',
                  margin: 0,
                  marginTop: 36,
                  marginLeft: -15,
                }}
              >
                {SOCIAL_LINKS.map((value, key) => (
                  <SocialLink key={key} {...value} />
                ))}
              </div>
            </Block>
          </div>
        </div>
      </Container>
    </>
  );
};

export default memo(HomePage);

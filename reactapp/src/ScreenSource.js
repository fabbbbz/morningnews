import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'
import { Redirect } from 'react-router-dom'
import './App.css';
import { List, Spin, Empty } from 'antd';
import CategoryAvatar from './CategoryAvatar'
import Nav from './Nav'
import { connect } from 'react-redux';

function ScreenSource(props) {
  const { selectedLang, token, changeLang } = props
  const [sourceList, setSourceList] = useState([])
  const [loading, setLoading] = useState(false);

  const APIResultsLoading = async (lang) => {
    var langue = 'fr'
    var country = 'fr'
    console.log('APIResultsLoading', lang)
    if (lang == 'en') {
      var langue = 'en'
      var country = 'us'
    }
    const data = await fetch(`https://newsapi.org/v2/sources?language=${langue}&country=${country}&apiKey=4bc7ad33bbfb4f63a530eacc4b57d768`)
    const body = await data.json()
    setLoading(false)
    setSourceList(body.sources ?? [])

  }

  useEffect(() => {
    const fetchLastLan = async () => {
      await fetch(`/last-langue?token=${token}`)
        .then(response => response.json())
        .then(result => {
          if (result.lang) {
            changeLang(result.lang);
            APIResultsLoading(result.lang);
          }
        })
    }
    if (!selectedLang) {
      fetchLastLan()
    }
    if (selectedLang) {
      APIResultsLoading(selectedLang)
    }
  }, [selectedLang])

  const getStyle = (isSelected) => {
    var style = {
      cursor: 'pointer',
      width: '40px',
      margin: '10px'
    }
    if (isSelected) {
      style.transform = 'scale(1.1, 1.1)';
      style.border = '1px white solid ';
      style.borderRadius = '50%';
    }
    return style
  }

  if (!token) {
    return <Redirect to='/' />
  }

  return (
    <div>
      <Nav />

      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }} className="Banner">
        <img key='fr' style={getStyle('fr' === props.selectedLang)} src='/images/fr.png' onClick={() => { setLoading(true); props.changeLang('fr'); }} />
        <img key='uk' style={getStyle('en' === props.selectedLang)} src='/images/uk.png' onClick={() => { setLoading(true); props.changeLang('en'); }} />
      </div>

      <div className="HomeThemes">
        <Spin spinning={loading}>
          {sourceList.length !== 0 && <List
            itemLayout="horizontal"
            dataSource={sourceList}
            renderItem={source => (
              <List.Item>
                <List.Item.Meta
                  avatar={<CategoryAvatar category={source.category} />}
                  title={<Link to={`/screenarticlesbysource/${source.id}`}>{source.name}</Link>}
                  description={source.description}
                />
              </List.Item>
            )}
          />}

        </Spin>
        {sourceList.length === 0 && <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description={
            <span>
              No articles
            </span>
          } />}
      </div>

    </div>
  );
}

function mapStateToProps(state) {
  return { selectedLang: state.selectedLang, token: state.token }
}

function mapDispatchToProps(dispatch) {
  return {
    changeLang: function (selectedLang) {
      dispatch({ type: 'changeLang', selectedLang: selectedLang })
    }
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ScreenSource)

import React, { useState, useEffect } from 'react';
import { Redirect } from 'react-router-dom'
import './App.css';
import { Card, Icon, Modal, Empty } from 'antd';
import Nav from './Nav'

import { connect } from 'react-redux'

const { Meta } = Card;

function ScreenMyArticles(props) {
  const { myArticles, token, selectedLang, addToWishList, deleteToWishList, resetWishlist } = props
  const [visible, setVisible] = useState(false)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [lang, setLang] = useState(selectedLang)

  var delArticle = async (title) => {
    deleteToWishList(title)
    const data = await fetch('/wishlist', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `title=${title}&token=${token}`
    })
  }

  var showModal = (title, content) => {
    setVisible(true)
    setTitle(title)
    setContent(content)

  }

  var handleOk = e => {
    setVisible(false)
  }

  var handleCancel = e => {
    setVisible(false)
  }

  var noArticles
  if (myArticles == 0) {
    noArticles = <Empty
      image={Empty.PRESENTED_IMAGE_SIMPLE}
      description={
        <span>
          No articles
        </span>
      } />
  }

  const loadWishlist = async () => {

    resetWishlist()
    await fetch(`/wishlist?token=${token}&lang=${lang}`)
      .then(response => response.json())
      .then(data => data.result.forEach((article) => {
        addToWishList(article)
      }))
  }

  useEffect(() => {
    loadWishlist()
  }, [lang])

  useEffect(() => {
    loadWishlist()
  }, [])

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

      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }} className="Banner" >
        <img key='fr' style={getStyle('fr' === lang)} src='/images/fr.png' onClick={() => { setLang('fr') }} />
        <img key='uk' style={getStyle('en' === lang)} src='/images/uk.png' onClick={() => { setLang('en') }} />

      </div>

      {noArticles}

      <div className="Card">


        {myArticles.map((article, i) => (
          <div key={i} style={{ display: 'flex', justifyContent: 'center' }}>

            <Card

              style={{
                width: 300,
                margin: '15px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
              cover={
                <img
                  alt="example"
                  src={article.urlToImage}
                />
              }
              actions={[
                <Icon type="read" key="ellipsis2" onClick={() => showModal(article.title, article.content)} />,
                <Icon type="delete" key="ellipsis" onClick={() => delArticle(article.title)} />
              ]}
            >

              <Meta
                title={article.title}
                description={article.description}
              />

            </Card>
            <Modal
              title={title}
              visible={visible}
              onOk={handleOk}
              onCancel={handleCancel}
            >
              <p>{content}</p>
            </Modal>
          </div>
        ))}
      </div>
    </div>
  );
}

function mapStateToProps(state) {
  return { myArticles: state.wishList, token: state.token, selectedLang: state.selectedLang }
}

function mapDispatchToProps(dispatch) {
  return {
    deleteToWishList: function (articleTitle) {
      dispatch({
        type: 'deleteArticle',
        title: articleTitle
      })
    },
    addToWishList: function (article, lang) {
      dispatch({
        type: 'addArticle',
        articleLiked: article,
        lang
      })
    },
    resetWishlist: function () {
      dispatch({
        type: 'resetWishlist'
      })
    },
  }
}



export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ScreenMyArticles);

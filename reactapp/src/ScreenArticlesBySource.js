import React, { useState, useEffect } from 'react';
import { Redirect, useParams } from 'react-router-dom';
import './App.css';
import { Card, Icon, Modal } from 'antd';
import Nav from './Nav'
import { connect } from 'react-redux'

const { Meta } = Card;

function ScreenArticlesBySource(props) {

  const [articleList, setArticleList] = useState([])

  const [visible, setVisible] = useState(false)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')

  var { id } = useParams();

  useEffect(() => {
    const findArticles = async () => {
      const data = await fetch(`/get-articles?id=${id}`)
      const body = await data.json()
      setArticleList(body.articles ?? [])
    }

    findArticles()
  }, [])

  var showModal = (title, content) => {
    setVisible(true)
    setTitle(title)
    setContent(content)
  }

  var handleOk = e => {
    console.log(e)
    setVisible(false)
  }

  var handleCancel = e => {
    console.log(e)
    setVisible(false)
  }

  var getArticle = async article => {
    props.addToWishList(article)
    console.log(article.title)
    console.log(props.token)
    const data = await fetch('/wishlist', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `title=${article.title}&content=${article.content}&desc=${article.description}&img=${article.urlToImage}&token=${props.token}&lang=${props.selectedLang}`
    })
  }

  if (!props.token) {
    return <Redirect to='/' />
  }
  return (
    <div>
      <Nav />
      <div className="Banner" />
      <div className="Card">
        {articleList.length !== 0 && articleList.map((article, i) => (
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
                <Icon type="like" key="ellipsis" onClick={() => { getArticle(article) }} />
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

function mapDispatchToProps(dispatch) {
  return {
    addToWishList: function (article, selectedLang) {
      dispatch({
        type: 'addArticle',
        articleLiked: article,
        selectedLang: selectedLang
      })
    }
  }
}

function mapStateToProps(state) {
  return { token: state.token, selectedLang: state.selectedLang }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ScreenArticlesBySource)

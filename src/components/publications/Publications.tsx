import {
  useEffect, useState
} from 'react'
import { css } from '@emotion/css'
import PublicationComponent from './PostView'
import { Theme } from '@/types/types'

export function Publications({
  publications
} : {
  publications?: any[]
}) {
  

  return (
    <div className={publicationsContainerStyle}>
      {
        publications?.map(publication => {
          return (
            <div key={`${publication.id}`} className={publicationContainerStyle}>
              <PublicationComponent
                publicationData={publication}
              />
            </div>
          )
        })
      }
    </div>
  )
}

const publicationsContainerStyle = css`
  @media (max-width: 510px) {
    width: 100%
  }
`

const publicationContainerStyle = css`
  margin-bottom: 12px;
`
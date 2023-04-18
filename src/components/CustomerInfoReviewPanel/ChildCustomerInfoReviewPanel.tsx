import React from 'react'

import { Icon } from 'components'
import { CustomerInfoFormValues } from 'models'

import './CustomerInfoReviewPanel.css'

interface CustomerInfoReviewPanelProps {
  formValues: CustomerInfoFormValues
  img?: string
  index: number
}

const CustomerInfoReviewPanel = ({ img, formValues, index }: CustomerInfoReviewPanelProps) => {
  return (
    <>
      <div className="my-4 font-bold">Dieťa {index + 1}</div>
      <div className="grid grid-cols-1 lg:grid-cols-2">
        {(formValues.name || img) && (
          <div className="grid col-span-1 gap-x-4 grid-cols-8">
            {img && (
              <div
                className="col-span-2 square rounded-full bg-center bg-cover bg-no-repeat"
                style={{
                  backgroundImage: `url(${img})`,
                }}
              />
            )}
            {formValues.name && (
              <div
                className={`${img ? 'col-span-6' : 'col-span-full'} flex items-center font-bold`}
              >
                {formValues.name}
              </div>
            )}
          </div>
        )}
        <div className="grid col-span-1 my-4 gap-x-4 grid-cols-8 lg:flex lg:ml-4 xl:ml-5">
          <div className="col-span-2 flex items-center justify-center">
            <Icon className="text-2xl" name="calendar" color="primary" />
          </div>
          <div className="col-span-6 flex items-center font-bold">{formValues.age}</div>
        </div>
        <div className="grid col-span-1"></div>
      </div>
    </>
  )
}

export default CustomerInfoReviewPanel

import React from 'react'

import { Icon } from 'components'
import { CustomerInfoFormValues } from 'models'

import './CustomerInfoReviewPanel.css'

interface CustomerInfoReviewPanelProps {
  formValues: CustomerInfoFormValues
  img?: string
}

const CustomerInfoReviewPanel = ({ img, formValues }: CustomerInfoReviewPanelProps) => {
  return (
    <div
      className={`${!img && 'ml-4'} grid ${
        formValues.zip || formValues.age ? 'custom-grid-rows' : 'grid-rows-1'
      }`}
    >
      <div className="grid-row-1 grid grid-cols-1 lg:grid-cols-2">
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
        <div className="grid col-span-1 my-4 gap-x-4 grid-cols-8">
          <div className={`flex items-center ${img ? 'justify-center col-span-2' : 'col-span-1'}`}>
            <Icon className="text-2xl" name="mail" color="primary" />
          </div>
          <div className="col-span-6 flex items-center font-bold">{formValues.email}</div>
        </div>
        <div className="grid col-span-1"></div>
      </div>
      {(formValues.zip || formValues.age) && (
        <>
          <div className="grid-row-1 grid grid-cols-16">
            {img && <div className="col-span-1 lg:col-span-2" />}
            <div
              className={`col-span-15 ${
                img ? 'lg:col-span-14' : 'lg:col-span-15'
              } flex items-center font-bold`}
            >
              Voliteľné údaje
            </div>
          </div>
          <div className="grid-row-1 grid grid-cols-16">
            {img && <div className="col-span-1 lg:col-span-2" />}

            <div className="col-span-15 lg:col-span-14 grid grid-cols-16">
              {formValues.zip && (
                <div className="grid col-span-7 gap-x-4 grid-cols-8">
                  <div className="col-span-2 lg:col-span-1 flex items-center justify-center lg:justify-start">
                    <Icon className="text-2xl" name="hashtag" color="primary" />
                  </div>
                  <div className="col-span-6 flex items-center font-bold">{formValues.zip}</div>
                </div>
              )}
              {formValues.age && (
                <div className="grid col-span-9 gap-x-4 grid-cols-8 lg:ml-3 xl:ml-4">
                  <div className="col-span-2 lg:col-span-1 flex items-center justify-center lg:justify-start">
                    <Icon className="text-2xl" name="calendar" color="primary" />
                  </div>
                  <div className="col-span-6 flex items-center font-bold">{formValues.age}</div>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default CustomerInfoReviewPanel

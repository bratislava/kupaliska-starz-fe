import React, { ReactNode } from 'react'

interface StyleGuideWrapperProps {
  children: ReactNode
}

const StyleGuideWrapper = ({ children }: StyleGuideWrapperProps) => {

   return (
    <main>
      <div className="min-h-screen bg-[#E5E5E5]">
        <div className="mx-auto max-w-screen-xl px-4 pb-64 md:px-8 md:pt-12">
          <h1 className="text-h1 mb-10 text-center  underline">Style Guide</h1>

          {children}
        </div>
      </div>
    </main>
  )
}

export default StyleGuideWrapper

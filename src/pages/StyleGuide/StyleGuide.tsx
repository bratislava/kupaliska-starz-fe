import React from 'react'
import StyleGuideWrapper from './components/StyleGuideWrapper'
import TagGroupShowCase from './showcases/TagGroupShowcase'
import TypographyShowcase from 'pages/StyleGuide/showcases/TypographyShowcase'

const StyleGuide = () => {
  /**
   * Always create new component for adding showcase in StyleGuide
   * Path to StyleGuide showcase components should be ./next/components/styleguide/showcases
   * */
  return (
    <StyleGuideWrapper>
      {/* HERE ADD SHOWCASES */}
      <TypographyShowcase />
      <TagGroupShowCase />
    </StyleGuideWrapper>
  )
}


export default StyleGuide

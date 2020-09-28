import React from 'react'
import renderer from 'react-test-renderer'
import _TestingGrounds from '../assets/js/screens/_TestingGrounds'



test('Renders at all', () => {
  const tree = renderer.create(<_TestingGrounds />).toJSON()
  expect(tree).toMatchSnapshot()
})
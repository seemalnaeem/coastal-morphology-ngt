<?xml version="1.0" encoding="UTF-8"?>
<StyledLayerDescriptor xmlns="http://www.opengis.net/sld" xmlns:gml="http://www.opengis.net/gml" version="1.0.0" xmlns:sld="http://www.opengis.net/sld" xmlns:ogc="http://www.opengis.net/ogc">
  <UserLayer>
    <sld:LayerFeatureConstraints>
      <sld:FeatureTypeConstraint/>
    </sld:LayerFeatureConstraints>
    <sld:UserStyle>
      <sld:Name>DTW(m)2030</sld:Name>
      <sld:FeatureTypeStyle>
        <sld:Rule>
          <sld:RasterSymbolizer>
            <sld:ChannelSelection>
              <sld:GrayChannel>
                <sld:SourceChannelName>1</sld:SourceChannelName>
              </sld:GrayChannel>
            </sld:ChannelSelection>
            <sld:ColorMap type="intervals">
              <sld:ColorMapEntry color="#2892c7" quantity="1.163" label="&lt;= 1.1630"/>
              <sld:ColorMapEntry color="#68a6b3" quantity="1.5" label="1.1630 - 1.5000"/>
              <sld:ColorMapEntry color="#bfd48a" quantity="2" label="1.5000 - 2.0000"/>
              <sld:ColorMapEntry color="#e7ed72" quantity="2.5" label="2.0000 - 2.5000"/>
              <sld:ColorMapEntry color="#fce45b" quantity="3" label="2.5000 - 3.0000"/>
              <sld:ColorMapEntry color="#fcb344" quantity="3.5" label="3.0000 - 3.5000"/>
              <sld:ColorMapEntry color="#fa8532" quantity="4" label="3.5000 - 4.0000"/>
              <sld:ColorMapEntry color="#f25622" quantity="4.5" label="4.0000 - 4.5000"/>
              <sld:ColorMapEntry color="#e81014" quantity="5" label="4.5000 - 5.0000"/>
              <sld:ColorMapEntry color="#e81014" quantity="10" label="5.0000 - 10.0000"/>
            </sld:ColorMap>
          </sld:RasterSymbolizer>
        </sld:Rule>
      </sld:FeatureTypeStyle>
    </sld:UserStyle>
  </UserLayer>
</StyledLayerDescriptor>

<?xml version="1.0" encoding="UTF-8"?>
<StyledLayerDescriptor xmlns="http://www.opengis.net/sld" xmlns:gml="http://www.opengis.net/gml" xmlns:sld="http://www.opengis.net/sld" version="1.0.0" xmlns:ogc="http://www.opengis.net/ogc">
  <UserLayer>
    <sld:LayerFeatureConstraints>
      <sld:FeatureTypeConstraint/>
    </sld:LayerFeatureConstraints>
    <sld:UserStyle>
      <sld:Name>Sea Level Rise Impact</sld:Name>
      <sld:FeatureTypeStyle>
        <sld:Rule>
          <sld:RasterSymbolizer>
            <sld:ChannelSelection>
              <sld:GrayChannel>
                <sld:SourceChannelName>1</sld:SourceChannelName>
              </sld:GrayChannel>
            </sld:ChannelSelection>
            <sld:ColorMap type="ramp">
              <sld:ColorMapEntry label="0.1000" quantity="0.099967665970324998" color="#2b83ba"/>
              <sld:ColorMapEntry label="0.1000" quantity="0.099971869587898346" color="#6db1af"/>
              <sld:ColorMapEntry label="0.1000" quantity="0.099976073205471694" color="#aedea5"/>
              <sld:ColorMapEntry label="0.1000" quantity="0.099980276823045056" color="#daf0b3"/>
              <sld:ColorMapEntry label="0.1000" quantity="0.099984480440618403" color="#fff9b8"/>
              <sld:ColorMapEntry label="0.1000" quantity="0.099988684058191751" color="#fecf87"/>
              <sld:ColorMapEntry label="0.1000" quantity="0.099992887675765099" color="#f89c59"/>
              <sld:ColorMapEntry label="0.1000" quantity="0.09999676793814051" color="#e65538"/>
              <sld:ColorMapEntry label="0.1000" quantity="0.10000000149012001" color="#d7191c"/>
            </sld:ColorMap>
          </sld:RasterSymbolizer>
        </sld:Rule>
      </sld:FeatureTypeStyle>
    </sld:UserStyle>
  </UserLayer>
</StyledLayerDescriptor>

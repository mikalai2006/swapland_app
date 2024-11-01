// You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/

import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { type IconProps } from "@expo/vector-icons/build/createIconSet";
import { type ComponentProps } from "react";

export function IconAwesome5({
  size,
  style,
  ...rest
}: IconProps<ComponentProps<typeof FontAwesome5>["name"]>) {
  return <FontAwesome5 size={size} style={[{}, style]} {...rest} />;
}

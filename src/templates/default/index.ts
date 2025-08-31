import '../_common/scripts';
import { applySpacing } from '../../styles/spacing';
import { applyTypography } from '../../styles/typography';
import { initDensity, cycleDensity } from '../../modules/settings/density';

applySpacing();
applyTypography();
initDensity();

// Expose toggle for debugging
(window as any).cycleDensity = cycleDensity;

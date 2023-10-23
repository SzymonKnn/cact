import discountCodeExample from './modules/discount-code/webpack.config.js';
import splitExample from './modules/discount-redemption-split/webpack.config.js';

/**
 *
 * @param environment
 * @param argv
 */
export default function config (environment, argv) {
    return [
        discountCodeExample(environment, argv),
        splitExample(environment, argv),
    ];
}
